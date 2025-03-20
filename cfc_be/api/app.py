"""Main application factory."""
from flask import Flask
from flask_cors import CORS

from .cfc_api import create_backend_app
from .cfc_api.extensions import Logger
from ..config import Config


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app)
    logger = Logger()
    logger.init_app(app)

    # Initialize backend app
    backend_app = create_backend_app()
    app.register_blueprint(backend_app)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
