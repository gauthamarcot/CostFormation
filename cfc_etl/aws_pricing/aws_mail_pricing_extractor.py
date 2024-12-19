#todo: based on the json import from the pricing api and import to db then we can decide on how
# to do be approach either update the existing pricing data or create snapshot and then update pricing data
from io import StringIO
#todo: based on the json import from the pricing api and import to db then we can decide on how
# to do be approach either update the existing pricing data or create snapshot and then update pricing data
from urllib import parse

import numpy as np
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
    chunk_size = 1000

    for document in price_meta_documents:
        service = document.get("service")
        json_url = document.get("csv")
        service = service.lower().replace("amazon", "amazon_").replace("aws", "aws_")
        print(f"Starting inserting {service}")
        # had to handle ec2 in a different way
        if json_url and service == "amazon_ec2":
            pricing_collection_name = f"{service}_pricing"
            try:
                response = requests.get(json_url)
                if response.status_code == 200:
                    lines = response.text.splitlines()[5:]
                    cleaned_csv_data = '\n'.join(lines)
                    csv_object = StringIO(cleaned_csv_data)
                    data = pd.read_csv(csv_object, chunksize=1000)

                    data.to_csv(f"/Users/gouthamarcot/Documents/TeleportPay/codebase/costformationcalculator/CostFormation/cfc_etl/data/{service}data.csv", index=False)
                    print(f"Inserted data for service {service} into {pricing_collection_name}")
                else:
                    print(f"Failed to fetch data for {service} from {json_url}. Status code: {response.status_code}")
            except Exception as e:
                print(f"An error occurred while processing {service}: {e}")
        elif json_url and service is not "amazon_ec2":
            pricing_collection_name = f"{service}_pricing"
            aws_pricing_collection = aws_pricing_db[pricing_collection_name]
            try:
                response = requests.get(json_url)
                if response.status_code == 200:
                    lines = response.text.splitlines()[5:]
                    cleaned_csv_data = '\n'.join(lines)
                    csv_object = StringIO(cleaned_csv_data)
                    for chunk in pd.read_csv(csv_object, chunksize=chunk_size):
                        aws_pricing_collection.insert_many(chunk.to_dict('records'))
                    print(f"Inserted data for service {service} into {pricing_collection_name}")
                else:
                    print(f"Failed to fetch data for {service} from {json_url}. Status code: {response.status_code}")
            except Exception as e:
                print(f"An error occurred while processing {service}: {e}")

if __name__ == '__main__':
    get_aws_meta()
