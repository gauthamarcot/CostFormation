"""Service Service."""
from typing import List, Dict, Any

def get_services() -> List[Dict[str, Any]]:
    """Get all available services."""
    # Mock service data (replace with database query)
    return [
        {
            'id': 'ec2-t2-micro',
            'name': 'EC2 t2.micro',
            'category': 'compute',
            'provider': 'aws',
            'description': 'General purpose instance type',
            'regions': ['us-east-1', 'us-west-2', 'eu-west-1'],
            'instanceTypes': ['t2.micro', 't2.small', 't2.medium']
        },
        {
            'id': 's3-standard',
            'name': 'S3 Standard Storage',
            'category': 'storage',
            'provider': 'aws',
            'description': 'Standard storage for frequently accessed data',
            'regions': ['us-east-1', 'us-west-2', 'eu-west-1']
        },
        {
            'id': 'azure-vm-basic',
            'name': 'Azure Basic VM',
            'category': 'compute',
            'provider': 'azure',
            'description': 'Basic virtual machine for development and testing',
            'regions': ['eastus', 'westus', 'northeurope'],
            'instanceTypes': ['Basic_A0', 'Basic_A1', 'Basic_A2']
        }
    ] 