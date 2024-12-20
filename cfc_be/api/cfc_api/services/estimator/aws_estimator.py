from cfc_be.api.cfc_api import db_service


def calculate_aws_cost(service, form_data):
    pass


def get_aws_estimator(service):
    data = []
    if service is None:
        return None
    try:
        for ser in service:
            db = db_service.get_client()["cfc_db"]
            col = db['aws_service_form'].find({})
            if col is None:
                return None
            for i in col:
                i.pop('_id')
                if ser in i:
                    data.append(i)
            return data
    except Exception as e:
        print(e)