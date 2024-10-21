from flask import Flask, Blueprint
from flask_restx import Api

from .extensions import db_service
from .routes import register_routes


api = Api(
    title='Teleport Pay Trading Frontend',
    version='0.1',
    description='Trading algorithm frontend APIs',
    doc='/fe/docs'
)


def create_backend_app(config_class='config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_class)

    cfc_bp = Blueprint('cfc_bp', __name__, url_prefix='/cfc/v1')

    api.init_app(cfc_bp)  # Register the API with the blueprint
    register_routes(api)  # Register routes with the API

    app.register_blueprint(cfc_bp)

    return cfc_bp  # Return the full app, not just the blueprint
