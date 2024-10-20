from flask_restx import Namespace, Resource

from cfc_be.api.cfc_api.services.aws_service import aws_services_list

api = Namespace('cp_service', description='Cloud service list api related operations')


@api.route('/cp_service/aws')
class CpServiceList(Resource):
    @api.doc('aws cp_service_list')
    def get(self):
        data = aws_services_list()
        if data:
            return data, 200
