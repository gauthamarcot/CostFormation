import boto3
from pprint import pprint

client = boto3.client('pricing', region_name='us-east-1')
service_client = boto3.client('servicecatalog')


def get_all_aws_services(next_token='', service_list=None):
    if service_list is None:
        service_list = []
    paginator = client.get_paginator('describe_services')
    if next_token and len(service_list) > 1:
        page_iterator = paginator.paginate(MaxResults=100, NextToken=next_token)
    else:
        page_iterator = paginator.paginate(MaxResults=100)
    for page in page_iterator:
        next_token = page['NextToken']
        for service in page['Services']:
            service_list.append(service['ServiceCode'])
        get_all_aws_services(next_token, service_list)
    print(service_list)
    # Call the 'get_attribute_values' API to get service names
    # response = client.describe_services(
    #     FormatVersion='aws_v1',
    #     MaxResults=100
    # )
    # services = response['Services']
    # for service in services:
    #     service_list.append(service['ServiceCode'])
    #
    # print(service_list)


# Get all AWS services with descriptions
def get_product_description(service_code):
    res = service_client.describe_product(AcceptLanguage='en-US', Name=service_code)
    print(res['ProductViewSummary'])


if __name__ == '__main__':
    # 'AWSELB'
    get_product_description('AWSELB')
    # get_all_aws_services(next_token='', service_list=[])
