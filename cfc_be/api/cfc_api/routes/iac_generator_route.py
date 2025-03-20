"""Infrastructure as Code Generator Routes."""
from flask import request
from flask_restx import Namespace, Resource, fields

from cfc_be.api.cfc_api.services.iac_generator.iac_gen import generate_template

api = Namespace('iac', description='Infrastructure as Code generation operations')

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

template_input = api.model('TemplateInput', {
    'services': fields.List(fields.Nested(service_config), required=True),
    'format': fields.String(required=True, enum=['yaml', 'json'], description='Template format'),
    'provider': fields.String(required=True, enum=['aws', 'azure', 'gcp', 'oracle'], description='Cloud provider')
})

@api.route('/generate')
class IaCGenerator(Resource):
    @api.doc('Generate Infrastructure as Code template',
             responses={
                 200: 'Success',
                 400: 'Invalid input',
                 500: 'Server error'
             })
    @api.expect(template_input)
    def post(self):
        """Generate Infrastructure as Code template."""
        try:
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400

            # Validate required fields
            if not all(k in data for k in ['services', 'format', 'provider']):
                return {'error': 'Missing required fields'}, 400

            # Generate template
            template = generate_template(
                services=data['services'],
                template_format=data['format'],
                provider=data['provider']
            )

            return {
                'template': template,
                'format': data['format'],
                'provider': data['provider']
            }, 200

        except ValueError as e:
            return {'error': str(e)}, 400
        except Exception as e:
            return {'error': f'Server error: {str(e)}'}, 500 