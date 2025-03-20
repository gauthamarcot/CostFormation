"""Service Routes."""
from flask_restx import Namespace, Resource, fields

from cfc_be.api.cfc_api.services.service_service import get_services

api = Namespace('services', description='Service operations')

@api.route('')
class ServiceList(Resource):
    @api.doc('Get all services',
             responses={
                 200: 'Success',
                 500: 'Server error'
             })
    def get(self):
        """Get all available services."""
        try:
            services = get_services()
            return {'services': services}, 200
        except Exception as e:
            return {'error': f'Server error: {str(e)}'}, 500 