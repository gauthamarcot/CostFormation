import boto3
from pprint import pprint

client = boto3.client('pricing', region_name='us-east-1')


def get_all_aws_services():
    service_list = []
    # Call the 'get_attribute_values' API to get service names
    response = client.describe_services(
        FormatVersion='aws_v1',
        MaxResults=100
    )
    services = response['Services']
    for service in services:
        service_list.append(service['ServiceCode'])

    print(service_list)


# Get all AWS services with descriptions

if __name__ == '__main__':
    get_all_aws_services()
