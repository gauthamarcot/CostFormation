from urllib import parse

username = "tp_cloud_test"
password = "TpSv@234@#"
password = parse.quote_plus(password)

MONGODB = "cfc_main"
MONGO_URI = f"mongodb+srv://{username}:{password}@tpfecluster.vslsueh.mongodb.net/?retryWrites=true&w=majority&appName=TPFECluster"
MONGODB_LOCAL_URI = "mongodb://localhost:27017/?retryWrites=true&loadBalanced=false&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000"

from pymongo.mongo_client import MongoClient


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


db_service = MongoDBService(MONGODB_LOCAL_URI, MONGODB)

import logging


class Logger:
    def init_app(self, app):
        handler = logging.StreamHandler()
        handler.setLevel(logging.INFO)
        app.logger.addHandler(handler)
        self.logger = app.logger


logger = Logger()
