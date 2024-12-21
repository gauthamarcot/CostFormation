import pymongo
from google.cloud import billing_v1
from google.oauth2 import service_account

# MongoDB connection details
MONGO_URI = f"mongodb://65.1.131.242:27017/?retryWrites=true&loadBalanced=false&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&3t.uriVersion=3&3t.alwaysShowAuthDB=true&3t.alwaysShowDBFromUserRole=true"
DATABASE_NAME = "cfc_db"
SERVICES_COLLECTION_NAME = "gcp_services"

# Path to your service account key file
SERVICE_ACCOUNT_KEY_FILE = "../data/empyrean-plexus-360208-ce8c5be73ed3.json"

# Initialize MongoDB client
mongo_client = pymongo.MongoClient(MONGO_URI)
db = mongo_client[DATABASE_NAME]
services_collection = db[SERVICES_COLLECTION_NAME]


def fetch_and_store_gcp_services() -> None:
    """
    Fetches the list of services from the Google Cloud Billing API and stores them in MongoDB
    in a format similar to AWS services, including service_code, description, service_regions, and search_words.
    """

    try:
        # Create credentials from the service account key file
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_KEY_FILE
        )

        # Initialize the Cloud Billing API client
        billing_client = billing_v1.CloudCatalogClient(credentials=credentials)

        # Fetch all services
        services = billing_client.list_services()

        for service in services:
            service_data = {
                "service_code": service.service_id,  # Use service_id as service_code
                "description": service.display_name,  # Use display_name as a description (GCP doesn't provide a detailed description like AWS)
                "service_regions": [],  # Placeholder for service regions (needs to be populated from SKU data, see below)
                "search_words": [service.display_name],  # Basic search words based on the display name (you'll likely need to improve this)
            }

            # Populate service_regions from SKUs (requires fetching SKUs)
            skus = billing_client.list_skus(parent=service.name)
            regions = set()  # Use a set to avoid duplicates
            for sku in skus:
                if sku.geo_taxonomy.type_ == "REGIONAL":
                    regions.update(sku.geo_taxonomy.regions)
                elif sku.geo_taxonomy.type_ == "GLOBAL":
                    regions.update(["global"])  # or some other indicator for global services
                else:
                     regions.update(sku.geo_taxonomy.regions)

            service_data["service_regions"] = list(regions)

            try:
                services_collection.insert_one(service_data)
                print(f"Inserted service: {service_data['service_code']}")
            except Exception as e:
                print(f"Could not insert service document: {e}")
                print(f"Problematic service document: {service_data}")

        print("Successfully inserted GCP services into MongoDB.")

    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    fetch_and_store_gcp_services()