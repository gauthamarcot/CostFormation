# we can use to get this for te prices
from cfc_be.api.cfc_api.extensions import db_service


def aws_services_list():
    try:
        db = db_service.get_client()['cfc_main']
        col = db['aws_services'].find({})
        res_li = []
        for i in col:
            for j in i['awsServices']:
                res_li.append({'name': j['name'], 'description': j['description'] if 'description' in j else j[
                                                                                                                 'name'] + "is an aws service",
                               'regions': j['regions'] if len(j['regions']) > 0 else ['global'],
                               'searchKeywords': j['searchKeywords'] if len(
                                   ['searchKeywords']) > 0 and 'searchKeywords' in j else j['name']})
        return res_li if len(res_li) > 0 else None
    except Exception as e:
        logger.error("error occurred due to ", e)


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
        logger.error("error occurred due to ", e)
