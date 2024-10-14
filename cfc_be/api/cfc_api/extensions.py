from urllib import parse

username = "tp_cloud_test"
password = "TpSv@234@#"
password = parse.quote_plus(password)

MONGODB = "tp_fe"
MONGO_URI = f"mongodb+srv://{username}:{password}@tpfecluster.vslsueh.mongodb.net/?retryWrites=true&w=majority&appName=TPFECluster"

from pymongo import MongoClient


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


db_service = MongoDBService(MONGO_URI, MONGODB)
