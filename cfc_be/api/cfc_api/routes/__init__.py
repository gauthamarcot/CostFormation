from cfc_be.api.cfc_api.routes.aws_routes import api as auth_ns
from cfc_be.api.cfc_api.routes.azure_routes import api as auth_ns
from cfc_be.api.cfc_api.routes.cp_service_route import api as auth_ns


def register_routes(api):
    api.add_namespace(auth_ns, path='/auth')
