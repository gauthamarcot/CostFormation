import oci
import pymongo
import os
from typing import Dict, Any

# MongoDB connection details
MONGO_URI = "mongodb://65.1.131.242:27017/"  # Replace with your MongoDB URI
DATABASE_NAME = "cfc_oci_pricing_db"
PRICING_COLLECTION_NAME = "oci_pricing"

# OCI Config file path (download from OCI console)
OCI_CONFIG_FILE = "~/.oci/config"  # Replace with the actual path to your config file
OCI_PROFILE_NAME = "DEFAULT"  # Replace with your profile name if not using the default

# Initialize MongoDB client
mongo_client = pymongo.MongoClient(MONGO_URI)
db = mongo_client[DATABASE_NAME]
oci_pricing_collection = db[PRICING_COLLECTION_NAME]

def dump_oci_pricing_data() -> None:
    """
    Fetches pricing data for Oracle Cloud Infrastructure services using the OCI SDK
    and stores it in MongoDB.
    """

    try:
        # Load OCI config file
        config = oci.config.from_file(OCI_CONFIG_FILE, OCI_PROFILE_NAME)

        # Initialize the Price List Management client
        price_list_client = oci.price_list.PriceListClient(config)

        # Get the current price list (you might need to adjust parameters based on your needs)
        price_list_response = price_list_client.get_price_list(
            type="CURRENT",
            # compartment_id="YOUR_COMPARTMENT_OCID",  # Optionally, filter by compartment
        )

        price_list_data = price_list_response.data

        # Process and insert pricing data
        for product_service in price_list_data.items:
            service_name = product_service.display_name
            print(f"Processing service: {service_name}")

            for product in product_service.products:
                product_data: Dict[str, Any] = {
                    "service_name": service_name,
                    "product_name": product.display_name,
                    "part_number": product.part_number,
                    "currency": product.currency_code,
                    "prices": [],  # List to store price information
                }

                for price in product.prices:
                    product_data["prices"].append(
                        {
                            "rate_type": price.rate_type,
                            "amount": price.value,
                            "model": price.model,
                        }
                    )

                try:
                    oci_pricing_collection.insert_one(product_data)
                except Exception as e:
                    print(f"Could not insert product document: {e}")
                    print(f"Problematic product document: {product_data}")

        print("Successfully inserted OCI pricing data into MongoDB.")

    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    dump_oci_pricing_data()