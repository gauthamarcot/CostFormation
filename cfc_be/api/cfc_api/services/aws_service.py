# we can use to get this for te prices
from cfc_be.api.cfc_api.extensions import db_service


def aws_services_list():
    try:
        db = db_service()
        if not db:
            print("error while connecting to db")
        db.