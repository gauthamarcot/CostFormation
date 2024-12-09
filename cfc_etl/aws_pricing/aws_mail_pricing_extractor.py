#todo: based on the json import from the pricing api and import to db then we can decide on how
# to do be approach either update the existing pricing data or create snapshot and then update pricing data
from io import StringIO
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
mongo_uri = f"mongodb://65.1.131.242:27017/?retryWrites=true&loadBalanced=false&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&3t.uriVersion=3&3t.alwaysShowAuthDB=true&3t.alwaysShowDBFromUserRole=true"

client = pymongo.MongoClient(mongo_uri)

main_db = client["cfc_db"]
main_collection = main_db["pricing_meta"]

aws_pricing_db = client["cfc_aws_pricing_db"]


def get_aws_meta():
    price_meta_documents = main_collection.find()
    for document in price_meta_documents:
        service = document.get("service")
        json_url = document.get("csv")
        service = service.lower().replace("amazon", "amazon_").replace("aws", "aws_")
        print(f"Starting inserting {service}")
        if json_url and service is not "amazon_s3":
            try:
                # Fetch JSON from the URL
                response = requests.get(json_url)

                if response.status_code == 200:
                    lines = response.text.splitlines()[5:]
                    cleaned_csv_data = '\n'.join(lines)  # Join them back together
                    csv_object = StringIO(cleaned_csv_data)
                    price_url_data = pd.read_csv(csv_object, low_memory=False)
                    if price_url_data.empty:
                        print(f"pricing_data is empty for {service}")
                    # Define the pricing collection name
                    pricing_collection_name = f"{service}_pricing"  # Assuming 'service' is defined somewhere
                    aws_pricing_collection = aws_pricing_db[pricing_collection_name]  # Assuming 'aws_pricing_db' is your database connection
                    # No need to extract 'products' since it's a CSV
                    products_pricing_data_df = price_url_data.to_dict(orient='records')
                    # Insert the data into the corresponding collection
                    try:
                        # Check for large data and split if necessary
                        if len(products_pricing_data_df) > 1000:
                            chunk_size = 1000
                            if service != 'aws_backup_pricing':

                                for i in range(0, len(products_pricing_data_df), chunk_size):
                                    # Use iloc to slice the DataFrame into chunks
                                    chunk = products_pricing_data_df[i:i + chunk_size]
                                    chunk_df = pd.DataFrame(chunk)

                                    aws_pricing_collection.insert_many(chunk_df.to_dict('records'))
                        else:
                            aws_pricing_collection.insert_many(products_pricing_data_df)

                        print(f"Inserted data for service {service} into {pricing_collection_name}")

                    except InvalidDocument as e:
                        print(f"Error inserting data for {service}: {e}")

                else:
                    print(f"Failed to fetch data for {service} from {json_url}. Status code: {response.status_code}")

            except Exception as e:
                print(f"An error occurred while processing {service}: {e}")


if __name__ == '__main__':
    get_aws_meta()
