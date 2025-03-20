from flask import request
from flask_restx import Namespace, Resource

from cfc_be.api.cfc_api.services.cloud_services import (
    aws_services_list, aws_regions_list,
    azure_services_list, azure_regions_list,
    gcp_services_list, gcp_regions_list,
    oracle_services_list, oracle_regions_list
)

api = Namespace('cp_service', description='Cloud service list api related operations')

# AWS Routes
@api.route('/aws/services')
class AWSCpServiceList(Resource):
    @api.doc('aws cp_service_list')
    def get(self):
        """Get list of AWS services."""
        try:
            data = aws_services_list()
            return data, 200
        except Exception as e:
            return {'error': str(e)}, 500

@api.route('/aws/regions')
class AWSCpServiceRegion(Resource):
    @api.doc('aws cp_service_region')
    def get(self):
        """Get list of AWS regions."""
        try:
            data = aws_regions_list()
            return data, 200
        except Exception as e:
            return {'error': str(e)}, 500

# GCP Routes
@api.route('/gcp/services')
class GCPCpServiceList(Resource):
    @api.doc('gcp cp_service_list')
    def get(self):
        """Get list of GCP services."""
        try:
            data = gcp_services_list()
            return data, 200
        except Exception as e:
            return {'error': str(e)}, 500

@api.route('/gcp/regions')
class GCPCpServiceRegion(Resource):
    @api.doc('gcp cp_service_region')
    def get(self):
        """Get list of GCP regions."""
        try:
            data = gcp_regions_list()
            return data, 200
        except Exception as e:
            return {'error': str(e)}, 500

# Azure Routes
@api.route('/azure/services')
class AzureCpServiceList(Resource):
    @api.doc('azure cp_service_list')
    def get(self):
        """Get list of Azure services."""
        try:
            data = azure_services_list()
            return data, 200
        except Exception as e:
            return {'error': str(e)}, 500

@api.route('/azure/regions')
class AzureCpServiceRegion(Resource):
    @api.doc('azure cp_service_region')
    def get(self):
        """Get list of Azure regions."""
        try:
            data = azure_regions_list()
            return data, 200
        except Exception as e:
            return {'error': str(e)}, 500

# Oracle Routes
@api.route('/oracle/services')
class OCICpServiceList(Resource):
    @api.doc('oracle cloud infra cp_service_list')
    def get(self):
        """Get list of Oracle Cloud services."""
        try:
            data = oracle_services_list()
            return data, 200
        except Exception as e:
            return {'error': str(e)}, 500

@api.route('/oracle/regions')
class OCICpServiceRegion(Resource):
    @api.doc('oracle cloud infra cp_service_region')
    def get(self):
        """Get list of Oracle Cloud regions."""
        try:
            data = oracle_regions_list()
            return data, 200
        except Exception as e:
            return {'error': str(e)}, 500
