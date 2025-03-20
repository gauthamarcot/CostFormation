"""Infrastructure as Code Generator Service."""
import json
import yaml
from typing import List, Dict, Any

# Template generators for different cloud providers
def generate_aws_template(services: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generate AWS CloudFormation template."""
    template = {
        "AWSTemplateFormatVersion": "2010-09-09",
        "Description": "Generated AWS CloudFormation template",
        "Resources": {}
    }

    for service in services:
        resource_name = f"{service['name'].replace(' ', '')}Resource"
        
        if service['category'] == 'compute':
            template["Resources"][resource_name] = {
                "Type": "AWS::EC2::Instance",
                "Properties": {
                    "InstanceType": service.get('instanceType', 't2.micro'),
                    "ImageId": "ami-0c55b159cbfafe1f0",  # Default Amazon Linux 2 AMI
                    "Tags": [{"Key": "Name", "Value": service['name']}]
                }
            }
        elif service['category'] == 'storage':
            template["Resources"][resource_name] = {
                "Type": "AWS::S3::Bucket",
                "Properties": {
                    "BucketName": service['name'].lower(),
                }
            }
        # Add more service types as needed

    return template

def generate_azure_template(services: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generate Azure ARM template."""
    template = {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {},
        "resources": []
    }

    for service in services:
        if service['category'] == 'compute':
            resource = {
                "type": "Microsoft.Compute/virtualMachines",
                "apiVersion": "2021-03-01",
                "name": service['name'],
                "location": service['region'],
                "properties": {
                    "hardwareProfile": {
                        "vmSize": service.get('instanceType', 'Standard_DS1_v2')
                    },
                    "osProfile": {
                        "computerName": service['name'],
                        "adminUsername": "azureuser"
                    }
                }
            }
            template["resources"].append(resource)
        # Add more service types as needed

    return template

def generate_gcp_template(services: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generate Google Cloud Deployment Manager template."""
    template = {
        "resources": []
    }

    for service in services:
        if service['category'] == 'compute':
            resource = {
                "name": service['name'],
                "type": "compute.v1.instance",
                "properties": {
                    "zone": service['region'],
                    "machineType": f"zones/{service['region']}/machineTypes/{service.get('instanceType', 'n1-standard-1')}",
                    "disks": [{
                        "boot": True,
                        "autoDelete": True,
                        "initializeParams": {
                            "sourceImage": "projects/debian-cloud/global/images/debian-10"
                        }
                    }]
                }
            }
            template["resources"].append(resource)
        # Add more service types as needed

    return template

def generate_oracle_template(services: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generate Oracle Cloud Infrastructure template."""
    template = {
        "variables": {},
        "resources": []
    }

    for service in services:
        if service['category'] == 'compute':
            resource = {
                "oci_core_instance": {
                    f"{service['name']}": {
                        "compartment_id": "${var.compartment_id}",
                        "availability_domain": service['region'],
                        "shape": service.get('instanceType', 'VM.Standard2.1'),
                        "display_name": service['name']
                    }
                }
            }
            template["resources"].append(resource)
        # Add more service types as needed

    return template

def generate_template(services: List[Dict[str, Any]], template_format: str, provider: str) -> str:
    """Generate Infrastructure as Code template based on provider and format."""
    # Validate inputs
    if not services:
        raise ValueError("No services provided")
    
    if template_format not in ['yaml', 'json']:
        raise ValueError("Invalid template format")
    
    if provider not in ['aws', 'azure', 'gcp', 'oracle']:
        raise ValueError("Invalid cloud provider")

    # Generate provider-specific template
    template_generators = {
        'aws': generate_aws_template,
        'azure': generate_azure_template,
        'gcp': generate_gcp_template,
        'oracle': generate_oracle_template
    }

    template = template_generators[provider](services)

    # Convert template to specified format
    if template_format == 'yaml':
        return yaml.dump(template, default_flow_style=False)
    else:  # json
        return json.dumps(template, indent=2)
