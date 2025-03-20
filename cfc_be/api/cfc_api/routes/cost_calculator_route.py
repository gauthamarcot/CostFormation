"""Cost Calculator Routes."""
from flask import request
from flask_restx import Namespace, Resource, fields

from cfc_be.api.cfc_api.services.cost_calculator.cost_calc import calculate_cost

api = Namespace('calculator', description='Cost calculation operations')

# Define input models for validation
service_config = api.model('ServiceConfig', {
    'id': fields.String(required=True, description='Service ID'),
    'name': fields.String(required=True, description='Service name'),
    'category': fields.String(required=True, description='Service category'),
    'provider': fields.String(required=True, description='Cloud provider'),
    'region': fields.String(required=True, description='Deployment region'),
    'quantity': fields.Integer(required=True, description='Number of instances'),
    'instanceType': fields.String(required=False, description='Instance type'),
    'storage': fields.Integer(required=False, description='Storage in GB'),
    'bandwidth': fields.Integer(required=False, description='Bandwidth in GB')
})

cost_input = api.model('CostInput', {
    'services': fields.List(fields.Nested(service_config), required=True)
})

@api.route('/calculate')
class CostCalculator(Resource):
    @api.doc('Calculate service costs',
             responses={
                 200: 'Success',
                 400: 'Invalid input',
                 500: 'Server error'
             })
    @api.expect(cost_input)
    def post(self):
        """Calculate costs for the provided services."""
        try:
            data = request.get_json()
            if not data or 'services' not in data:
                return {'error': 'No services provided'}, 400

            # Calculate costs
            costs = calculate_cost(data['services'])

            return {
                'costs': costs,
                'services': data['services']
            }, 200

        except ValueError as e:
            return {'error': str(e)}, 400
        except Exception as e:
            return {'error': f'Server error: {str(e)}'}, 500 