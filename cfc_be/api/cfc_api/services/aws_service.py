# we can use to get this for te prices
from cfc_be.api.cfc_api.extensions import db_service


def aws_services_list():
    try:
        db = db_service.get_client()['cfc_db']
        col = db['aws_services'].find({})
        res_li = []
        for j in col:
            res_li.append({'name': j['service_code'],
                           'description': j['description'],
                           'regions': j['service_regions'],
                           'search_words': j['search_words']})
        return res_li if len(res_li) > 0 else None
    except Exception as e:
        print("error occurred due to ", e)


def aws_regions_list():
    try:
        db = db_service.get_client()['cfc_main']
        col = db['aws_regions'].find({})
        res_li = []
        for i in col:
            i.pop('_id')
            res_li.append(i)
        return res_li if len(res_li) > 0 else None
    except Exception as e:
        print(e)
