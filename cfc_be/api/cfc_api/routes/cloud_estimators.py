from flask import request
from flask_restx import Namespace, Resource, fields

# from cfc_be.api.cfc_api.extensions import logger
from cfc_be.api.cfc_api.services.estimator.estimator_controller import estimator_controller, cloud_calculator_controller

api = Namespace('cloud_estimators', description='Cloud cost estimation and calculation endpoints')

# Define input models for validation
service_model = api.model('Service', {
    'id': fields.String(required=True, description='Service ID'),
    'name': fields.String(required=True, description='Service name'),
    'category': fields.String(required=True, description='Service category'),
    'provider': fields.String(required=True, description='Cloud provider'),
    'quantity': fields.Integer(required=True, description='Number of instances'),
    'region': fields.String(required=True, description='Deployment region'),
    'instanceType': fields.String(required=False, description='Instance type (if applicable)'),
    'storage': fields.Integer(required=False, description='Storage in GB (if applicable)'),
    'bandwidth': fields.Integer(required=False, description='Bandwidth in GB (if applicable)')
})

estimator_input = api.model('EstimatorInput', {
    'services': fields.List(fields.Nested(service_model), required=True, description='List of services to estimate')
})

@api.route('/estimate')
class CloudEstimators(Resource):
    @api.doc('Get cost estimation for cloud services',
             responses={
                 200: 'Success',
                 400: 'Invalid input',
                 500: 'Server error'
             })
    @api.expect(estimator_input)
    def post(self):
        """Get cost estimation for cloud services."""
        try:
            data = request.get_json()
            if not data or 'services' not in data:
                return {'error': 'Invalid input: services list is required'}, 400

            response, status = estimator_controller(data)
            return response, status

        except Exception as e:
            return {'error': f'Server error: {str(e)}'}, 500


@api.route('/calculate')
class CloudCalculateCost(Resource):
    @api.doc('Calculate detailed costs for cloud services',
             responses={
                 200: 'Success',
                 400: 'Invalid input',
                 500: 'Server error'
             })
    @api.expect(estimator_input)
    def post(self):
        """Calculate detailed costs for cloud services."""
        try:
            data = request.get_json()
            if not data or 'services' not in data:
                return {'error': 'Invalid input: services list is required'}, 400

            for service in data['services']:
                if not all(k in service for k in ['id', 'name', 'category', 'provider', 'quantity', 'region']):
                    return {'error': f'Invalid service data: missing required fields for service {service.get("name", "unknown")}'}, 400

            response, status = cloud_calculator_controller(data)
            return response, status

        except Exception as e:
            return {'error': f'Server error: {str(e)}'}, 500

