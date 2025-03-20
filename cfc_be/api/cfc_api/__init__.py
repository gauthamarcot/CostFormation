"""Cost Formation Calculator API."""
from flask import Blueprint
from flask_restx import Api

from cfc_be.api.cfc_api.extensions import db_service
from cfc_be.api.cfc_api.routes import register_routes
from .routes.iac_generator_route import api as iac_ns

# Create blueprint
cfc_bp = Blueprint('cfc_bp', __name__, url_prefix='/cfc/v1')

# Create API instance
api = Api(
    cfc_bp,
    title='Cost Formation Calculator API',
    version='1.0',
    description='API for calculating cloud service costs and generating IaC templates',
    doc='/cfc/docs'
)

def create_backend_app():
    """Create and configure the backend application."""
    # Register routes
    register_routes(api)
    
    return cfc_bp
