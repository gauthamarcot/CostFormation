import json

import boto3
from pprint import pprint

import pymongo

client = boto3.client('pricing', region_name='us-east-1')
service_client = boto3.client('servicecatalog')


def get_all_aws_services(next_token='', service_list=None, page=None):
    if service_list is None:
        service_list = []
    paginator = client.get_paginator('describe_services')
    if hasattr(page, 'NextToken') and len(service_list) > 1:
        page_iterator = paginator.paginate(MaxResults=100, NextToken=next_token)
    else:
        page_iterator = paginator.paginate(MaxResults=100)
    for page in page_iterator:
        next_token = page['NextToken']
        for service in page['Services']:
            service_list.append({'service': service['ServiceCode'], 'search_attributes': service['AttributeNames']})
        get_all_aws_services(next_token, service_list, page)
    print(service_list)
    # Call the 'get_attribute_values' API to get service names
    response = client.describe_services(
        FormatVersion='aws_v1',
        MaxResults=100
    )
    services = response['Services']
    for service in service_list:
        service_list.append(service['ServiceCode'])
    print(service_list)


# Get all AWS services with descriptions
def get_product_description(service_code):
    res = service_client.describe_product(AcceptLanguage='en-US', Name=service_code)
    print(res['ProductViewSummary'])

mongo_uri = f"mongodb://13.201.34.47:27017/?retryWrites=true&loadBalanced=false&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&3t.uriVersion=3&3t.alwaysShowAuthDB=true&3t.alwaysShowDBFromUserRole=true"

client = pymongo.MongoClient(mongo_uri)

main_db = client["cfc_db"]
aws_services = main_db["aws_services"]
def json_to_monogo(json_path):
    with open(json_path) as f:
        data = json.load(f)
        service_list = []
        for service in data['awsServices']:
            service_list.append({'service_code': service['name'],
                                 'description': service['description'] if 'description' in service else f"{service['name']} is an AWS service",
                                 'service_regions': service['regions'] if not hasattr(service, 'regions') else ['global'],
                                 'search_words': service['searchKeywords'] if 'searchKeywords' in service else [service['name']]})
        aws_services.insert_many(service_list)

if __name__ == '__main__':
    json_to_monogo(
        '/Users/gouthamarcot/Documents/TeleportPay/codebase/costformationcalculator/CostFormation/cfc_etl/data'
        '/ser_des.json')
    # get_all_aws_services(next_token='', service_list=[])
