from flask import request
from flask_restx import Namespace, Resource

from cfc_be.api.cfc_api.services.aws_service import aws_services_list, aws_regions_list

api = Namespace('cp_service', description='Cloud service list api related operations')


@api.route('/aws/services')
class AWSCpServiceList(Resource):
    @api.doc('aws cp_service_list')
    def get(self):
        print(f"sending aws cp_service_list to {request.remote_addr}")
        data = aws_services_list()
        if data:
            return data, 200


@api.route('/aws/region')
class AWSCpServiceRegion(Resource):
    @api.doc('aws cp_service_region')
    def get(self):
        print(f"sending aws cp_service_region to {request.remote_addr}")
        data = aws_regions_list()
        if data:
            return data, 200


@api.route('/gcp')
class GCPCpServiceList(Resource):
    @api.doc('gcp cp_service_list')
    def get(self):
        print(f"sending gcp cp_service_list to {request.remote_addr}")
        data = aws_services_list()
        if data:
            return data, 200


# route for azure service list
@api.route('/azure')
class AzureCpServiceList(Resource):
    @api.doc('azure cp_service_list')
    def get(self):
        print(f"sending azure cp_service_list to {request.remote_addr}")
        data = aws_services_list()
        if data:
            return data, 200


# route for oracle cloud service list
@api.route('/oci')
class OCICpServiceList(Resource):
    @api.doc('oracle cloud infra cp_service_list')
    def get(self):
        print(f"sending oci cp_service_list to {request.remote_addr}")
        data = aws_services_list()
        if data:
            return data, 200
