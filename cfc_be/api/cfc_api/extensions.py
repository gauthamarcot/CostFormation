"""Extensions module for the Cost Formation Calculator API."""
import os
from urllib import parse
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
import logging

# Load environment variables
load_dotenv()

# MongoDB configuration
MONGODB_USERNAME = os.getenv('MONGODB_USERNAME')
MONGODB_PASSWORD = os.getenv('MONGODB_PASSWORD')
MONGODB_DATABASE = os.getenv('MONGODB_DATABASE')
MONGODB_URI = os.getenv('MONGODB_URI')
MONGODB_LOCAL_URI = os.getenv('MONGODB_LOCAL_URI')

class MongoDBService:
    def __init__(self, db_uri, db_name):
        self.client = MongoClient(db_uri)
        self.db = self.client[db_name]

    def get_client(self):
        return self.client

    def insert_document(self, collection_name, document):
        collection = self.db[collection_name]
        return collection.insert_one(document).inserted_id

    def find_documents(self, collection_name, query=None):
        if query is None:
            query = {}
        collection = self.db[collection_name]
        return list(collection.find(query))

    def update_document(self, collection_name, query, new_values):
        collection = self.db[collection_name]
        return collection.update_one(query, {'$set': new_values})

    def delete_document(self, collection_name, query):
        collection = self.db[collection_name]
        return collection.delete_one(query)

# Initialize MongoDB service with local URI
db_service = MongoDBService(MONGODB_LOCAL_URI, MONGODB_DATABASE)

class Logger:
    def __init__(self):
        self.logger = None

    def init_app(self, app):
        handler = logging.StreamHandler()
        handler.setLevel(logging.INFO)
        app.logger.addHandler(handler)
        self.logger = app.logger



