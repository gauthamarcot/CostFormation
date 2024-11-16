#todo: based on the json import from the pricing api and import to db then we can decide on how
# to do be approach either update the existing pricing data or create snapshot and then update pricing data

#todo: based on the json import from the pricing api and import to db then we can decide on how
# to do be approach either update the existing pricing data or create snapshot and then update pricing data
from urllib import parse

import pymongo
import requests
from bson import InvalidDocument
import pandas as pd
from pandas import DataFrame

username = "tp_cloud_test"

password = "TpSv@234@#"
password = parse.quote_plus(password)
# MongoDB connection details
mongo_uri = f"mongodb://3.111.218.66:27017/?retryWrites=true&loadBalanced=false&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&3t.uriVersion=3&3t.alwaysShowAuthDB=true&3t.alwaysShowDBFromUserRole=true"

client = pymongo.MongoClient(mongo_uri)

main_db = client["cfc_db"]
main_collection = main_db["pricing_meta"]


aws_pricing_db = client["cfc_aws_pricing_db"]


def get_aws_meta():
    price_meta_documents = main_collection.find()
    for document in price_meta_documents:
        service = document.get("service")
        json_url = document.get("json")
        service = service.lower().replace("amazon", "amazon_").replace("aws", "aws_")

        if json_url:
            try:
                # Fetch JSON from the URL
                response = requests.get(json_url)

                if response.status_code == 200:
                    price_url_data = response.json()

                    # Define the pricing collection name
                    pricing_collection_name = f"{service}_pricing"
                    aws_pricing_collection = aws_pricing_db[pricing_collection_name]

                    # Extract pricing data from the response
                    products_pricing_data = price_url_data.get('products', [])

                    if not products_pricing_data:
                        print(f"No products found in the JSON for {service}")
                        continue
                    products_pricing_data_df = pd.DataFrame.from_dict(products_pricing_data, orient='index').reset_index().drop('index', axis=1).to_dict(orient='records')

                    # Insert the data into the corresponding collection
                    try:
                        # Check for large data and split if necessary
                        if len(products_pricing_data_df) > 1000:
                            chunk_size = 1000
                            if service != 'aws_backup_pricing':
                                print(f"Starting inserting {service}")
                                for i in range(0, len(products_pricing_data_df), chunk_size):
                                    # Use iloc to slice the DataFrame into chunks
                                    chunk = products_pricing_data_df[i:i + chunk_size]
                                    chunk_df = pd.DataFrame(chunk)

                                    aws_pricing_collection.insert_many(chunk_df.to_dict('records'))
                        else:
                            aws_pricing_collection.insert_one({"service": service, "data": products_pricing_data})

                        print(f"Inserted data for service {service} into {pricing_collection_name}")

                    except InvalidDocument as e:
                        print(f"Error inserting data for {service}: {e}")

                else:
                    print(f"Failed to fetch data for {service} from {json_url}. Status code: {response.status_code}")

            except Exception as e:
                print(f"An error occurred while processing {service}: {e}")


if __name__ == '__main__':
    get_aws_meta()