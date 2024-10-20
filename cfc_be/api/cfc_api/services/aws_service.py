# we can use to get this for te prices
from cfc_be.api.cfc_api.extensions import db_service


def aws_services_list():
    try:
        db = db_service.get_client()['cfc_main']
        col = db['aws_services'].find({})
        res_li = []
        for i in col:
            for j in i['awsServices']:
                res_li.append({'name': j['name'], 'description': j['description'], 'regions': j['regions'],
                               'searchKeywords': j['searchKeywords']})
        return res_li if len(res_li) > 0 else None
    except Exception as e:
        print(e)
        print("error while connecting to db")
