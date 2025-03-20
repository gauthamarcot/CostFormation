from pymongo import MongoClient
from datetime import datetime

# MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client["cfc_db"]

# Mock data for different cloud providers
MOCK_SERVICES = [
    # AWS Services
    {
        "id": "ec2",
        "name": "Amazon EC2",
        "description": "Virtual servers in the cloud",
        "provider": "aws",
        "regions": ["us-east-1", "us-west-2", "eu-west-1"],
        "search_words": ["compute", "server", "instance", "virtual machine"],
        "pricing_model": {
            "type": "on-demand",
            "unit": "hour",
            "base_price": 0.1
        },
        "specifications": {
            "instance_types": ["t2.micro", "t2.small", "t2.medium"],
            "os_types": ["Linux", "Windows"]
        }
    },
    {
        "id": "s3",
        "name": "Amazon S3",
        "description": "Object storage service",
        "provider": "aws",
        "regions": ["us-east-1", "us-west-2", "eu-west-1"],
        "search_words": ["storage", "bucket", "object", "file"],
        "pricing_model": {
            "type": "usage-based",
            "unit": "GB-month",
            "base_price": 0.023
        }
    },
    # Azure Services
    {
        "id": "vm",
        "name": "Azure Virtual Machines",
        "description": "Scalable on-demand computing resources",
        "provider": "azure",
        "regions": ["eastus", "westus", "northeurope"],
        "search_words": ["compute", "virtual machine", "server"],
        "pricing_model": {
            "type": "on-demand",
            "unit": "hour",
            "base_price": 0.12
        }
    },
    # GCP Services
    {
        "id": "compute",
        "name": "Google Compute Engine",
        "description": "Scalable, high-performance virtual machines",
        "provider": "gcp",
        "regions": ["us-central1", "europe-west1", "asia-east1"],
        "search_words": ["compute", "virtual machine", "server"],
        "pricing_model": {
            "type": "on-demand",
            "unit": "hour",
            "base_price": 0.08
        }
    },
    # Oracle Services
    {
        "id": "oci-compute",
        "name": "Oracle Cloud Infrastructure Compute",
        "description": "High-performance compute instances",
        "provider": "oracle",
        "regions": ["us-ashburn-1", "eu-frankfurt-1", "ap-singapore-1"],
        "search_words": ["compute", "virtual machine", "server"],
        "pricing_model": {
            "type": "on-demand",
            "unit": "hour",
            "base_price": 0.09
        }
    }
]

def init_db():
    """Initialize the database with mock data."""
    # Clear existing data
    db.services.delete_many({})
    
    # Insert mock data
    for service in MOCK_SERVICES:
        db.services.update_one(
            {"id": service["id"], "provider": service["provider"]},
            {"$set": service},
            upsert=True
        )
    
    print("Database initialized with mock data")

if __name__ == "__main__":
    init_db() 