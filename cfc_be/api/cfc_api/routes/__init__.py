"""Routes registration."""
from flask_restx import Api

from .cost_calculator_route import api as calculator_ns
from .service_route import api as service_ns
from .iac_generator_route import api as iac_ns

def register_routes(api: Api):
    """Register all routes with the API."""
    api.add_namespace(calculator_ns)
    api.add_namespace(service_ns)
    api.add_namespace(iac_ns)
