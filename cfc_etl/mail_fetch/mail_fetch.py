from datetime import datetime
from urllib import parse

import jwt
import pymongo
import requests
from msal import ConfidentialClientApplication

password = parse.quote_plus(password)
# MongoDB connection details
mongo_uri = f"mongodb+srv://tp_cloud_test:{password}@tpfecluster.vslsueh.mongodb.net/tr"  # Replace with your MongoDB connection string
database_name = "cfc_db"  # Replace with your database name
collection_name = "pricing_meta"  # Replace with your collection name

# Connect to MongoDB
client = pymongo.MongoClient(mongo_uri)
db = client[database_name]
mongo_collection = db[collection_name]

# Connect to Outlook
client_id = "f2f95004-6597-4ec3-86b5-5bd40ae5e263"
tenant_id = "7713d6d6-471c-4450-9889-f1a0efad18cb"
user_id = "b2089d50-94bc-43c9-a80b-d554133082b7"

# b2089d50-94bc-43c9-a80b-d554133082b7
authority = f"https://login.microsoftonline.com/{tenant_id}"
scopes = ["https://graph.microsoft.com/.default"]

app = ConfidentialClientApplication(
    client_id=client_id,
    authority=authority,
    client_credential=client_secret
)

graph_api_endpoint = "https://graph.microsoft.com/v1.0"


# Function to get the access token
def get_access_token():
    result = app.acquire_token_silent(scopes, account=None)
    if not result:
        result = app.acquire_token_for_client(scopes=scopes)
    if "access_token" in result:
        return result["access_token"]
    else:
        raise Exception("Could not acquire access token.")


# Function to retrieve emails from a specific folder in Outlook
def get_emails(folder_id="Inbox"):
    token = get_access_token()
    decoded_token = jwt.decode(token, options={"verify_signature": False})
    headers = {"Authorization": f"Bearer {token}"}
    url=f"https://graph.microsoft.com/v1.0/users/{user_id}/mailFolders/AAMkADg2NDAxNjcyLTQ2OTEtNDkyZS04N2IzLTFhYjIyZTAyMDA4MAAuAAAAAACyULlGB0wnT6bMiNfR1HbFAQBAKVD2viGkR7S50XL_2ISyAAD3xhkXAAA=/messages"
    all_emails = []

    while url:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            all_emails.extend(data.get("value", []))
            # Check for nextLink in the response to continue pagination
            url = data.get("@odata.nextLink")
        else:
            print(f"Error fetching emails: {response.status_code}, {response.json()}")
            break

    return all_emails


# Function to save email data to MongoDB
def save_emails_to_mongo(emails):
    for email in emails:
        service, json, csv = extract_links_and_service(email.get("body")['content'])
        email_data = {
            "service": service,
            "receivedDateTime": email.get("receivedDateTime"),
            "json": json,
            "csv": csv,
        }
        # Add timestamp and insert into MongoDB collection
        existing_service = mongo_collection.find_one({"service": service})

        if existing_service:
            # If the service exists, update or log that the service is already present
            print(f"Service '{service}' already exists in MongoDB. Skipping insert.")
        else:
            # If the service doesn't exist, insert the new email data
            mongo_collection.insert_one(email_data)
            print("Email saved to MongoDB:", email_data)


def extract_links_and_service(email_body):
  # Extract service name
  service_line = [line for line in email_body.splitlines() if "offer file for Service" in line]
  if service_line:
    service_name = service_line[0].split("offer file for Service")[1].strip().split(".")[0]
  else:
    service_name = "Unknown"  # Or handle the case where the service name is not found

  # Extract JSON link
  json_link = email_body.split("JSON format :")[1].split("\n")[0].strip() if "JSON format :" in email_body else None

  # Extract CSV link
  csv_link = email_body.split("CSV format :")[1].split("\n")[0].strip() if "CSV format :" in email_body else None

  return service_name, json_link, csv_link

# Main function to fetch and save emails
def main():
    folder_id = "aws_pricing"  # You can replace with the folder you need
    emails = get_emails(folder_id)
    if emails:
        save_emails_to_mongo(emails)
    else:
        print("No emails found in the specified folder.")


if __name__ == "__main__":
    main()
