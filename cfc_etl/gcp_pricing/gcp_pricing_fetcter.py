import pymongo
from google.cloud import billing_v1
from google.oauth2 import service_account
from google.protobuf.json_format import MessageToDict
from typing import Dict, List, Any

# MongoDB connection details
MONGO_URI = f"mongodb://65.1.131.242:27017/?retryWrites=true&loadBalanced=false&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&3t.uriVersion=3&3t.alwaysShowAuthDB=true&3t.alwaysShowDBFromUserRole=true"
DATABASE_NAME = "cfc_gcp_pricing_db"

# Path to your service account key file
SERVICE_ACCOUNT_KEY_FILE = "../data/empyrean-plexus-360208-ce8c5be73ed3.json"

# Initialize MongoDB client
mongo_client = pymongo.MongoClient(MONGO_URI)
db = mongo_client[DATABASE_NAME]


def dump_gcp_pricing_data() -> None:
    """
    Fetches pricing data for Google Cloud Platform services using the Cloud Billing API.
    Stores both raw SKU-level data and aggregated service-level pricing data in MongoDB.
    Uses a service account for authentication.
    """

    try:
        # Create credentials from the service account key file
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_KEY_FILE,
        )

        # Initialize the Cloud Billing API client with the service account credentials
        billing_client = billing_v1.CloudCatalogClient(credentials=credentials)

        # Fetch all services
        services = billing_client.list_services()

        for service in services:
            service_id = service.name.split("/")[1]
            service_display_name = service.display_name

            # Sanitize the service name for the collection name
            collection_name = (
                service_display_name.lower()
                .replace(" ", "_")
                .replace("-", "_")
                .replace(".", "_")
            )

            # Get a reference to the SKU-level collection for this service
            sku_collection_name = f"{collection_name}_pricing"
            sku_collection = db[sku_collection_name]

            # Get a reference to the service-level collection for this service
            service_collection_name = f"{collection_name}_service_pricing"
            service_collection = db[service_collection_name]

            print(
                f"Processing service: {service_display_name} ({service_id}) - SKU Collection: {sku_collection_name} - Service Collection: {service_collection_name}"
            )

            skus = billing_client.list_skus(parent=service.name)
            # Initialize the service-level document
            service_pricing_data: Dict[str, Any] = {
                "serviceId": service_id,
                "serviceDisplayName": service_display_name,
                "skuCategories": {},  # Use a dictionary to group by category
            }
            for sku in skus:
                # Convert the SKU object to a dictionary
                sku_dict = MessageToDict(sku._pb)

                # Add service information to the SKU data
                sku_dict["serviceId"] = service_id
                sku_dict["serviceDisplayName"] = service_display_name

                # Insert raw SKU-level data
                try:
                    sku_collection.insert_one(sku_dict)
                except Exception as e:
                    print(f"Could not insert SKU document: {e}")
                    print(f"Problematic SKU document: {sku_dict}")

                # Convert the 'regions' Repeated field to a list for the summarized SKU
                regions_list = [region for region in sku.geo_taxonomy.regions]

                # Categorize SKUs for service-level summary
                category = sku.category.resource_family
                if category not in service_pricing_data["skuCategories"]:
                    service_pricing_data["skuCategories"][category] = []

                service_pricing_data["skuCategories"][category].append(
                    {
                        "skuId": sku.sku_id,
                        "description": sku.description,
                        "regions": regions_list,  # Store regions as a list
                        "pricingInfo": sku_dict["pricingInfo"]
                    }
                )

            # Insert service-level pricing data
            try:
                service_collection.insert_one(service_pricing_data)
            except Exception as e:
                print(f"Could not insert service document: {e}")
                print(f"Problematic service document: {service_pricing_data}")

            print(
                f"Finished processing SKUs for: {service_display_name} in collections: {sku_collection_name}, {service_collection_name}"
            )

        print("Successfully inserted GCP pricing data into MongoDB.")

    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    dump_gcp_pricing_data()