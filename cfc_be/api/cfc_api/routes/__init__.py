from cfc_be.api.cfc_api.routes.aws_routes import api as cp_ns
from cfc_be.api.cfc_api.routes.azure_routes import api as cp_ns
from cfc_be.api.cfc_api.routes.cp_service_route import api as cp_ns
from cfc_be.api.cfc_api.routes.cloud_estimators import api as cloud_estimators_ns


def register_routes(api):
    api.add_namespace(cp_ns, path='/cp_service')
    api.add_namespace(cloud_estimators_ns, path='/cloud-estimators')
