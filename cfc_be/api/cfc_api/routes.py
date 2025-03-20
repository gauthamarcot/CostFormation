from cfc_be.api.cfc_api.routes.cloud_estimators import api as estimator_ns
from cfc_be.api.cfc_api.routes.cp_service_route import api as cp_service_ns

def register_routes(api):
    """Register all API routes."""
    api.add_namespace(estimator_ns, path='/estimator')
    api.add_namespace(cp_service_ns, path='/services')
