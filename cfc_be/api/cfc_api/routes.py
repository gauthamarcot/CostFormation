from app_backend.routes.auth_routes import api as auth_ns
from app_backend.routes.kyc_routes import api as kyc_ns
from app_backend.routes.strategies_routes import api as strategies_ns
from app_backend.routes.order_management_routes import api as order_management_ns
from app_backend.routes.order_execution_routes import api as order_execution_ns


def register_routes(api):
    api.add_namespace(auth_ns, path='/auth')
    api.add_namespace(kyc_ns, path='/kyc')
    api.add_namespace(strategies_ns, path='/strategies')
    api.add_namespace(order_management_ns, path='/orders')
    api.add_namespace(order_execution_ns, path='/order_execution')
