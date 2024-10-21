from flask import request
from flask_restx import Namespace, Resource

from cfc_be.api.cfc_api.extensions import logger
from cfc_be.api.cfc_api.services.aws_service import aws_services_list

api = Namespace('cp_service', description='Cloud service list api related operations')


@api.route('/cp_service/aws')
class AWSCpServiceList(Resource):
    @api.doc('aws cp_service_list')
    def get(self):
        logger.info(f"sending aws cp_service_list to {request.remote_addr}")
        data = aws_services_list()
        if data:
            return data, 200

@api.route('/cp_service/gcp')
class GCPCpServiceList(Resource):
    @api.doc('gcp cp_service_list')
    def get(self):
        logger.info(f"sending gcp cp_service_list to {request.remote_addr}")
        data = aws_services_list()
        if data:
            return data, 200

# route for azure service list
@api.route('/cp_service/azure')
class AzureCpServiceList(Resource):
    @api.doc('azure cp_service_list')
    def get(self):

        logger.info(f"sending azure cp_service_list to {request.remote_addr}")
        data = aws_services_list()
        if data:
            return data, 200

# route for oracle cloud service list
@api.route('/cp_service/oci')
class OCICpServiceList(Resource):
    @api.doc('oracle cloud infra cp_service_list')
    def get(self):
        logger.info(f"sending oci cp_service_list to {request.remote_addr}")
        data = aws_services_list()
        if data:
            return data, 200