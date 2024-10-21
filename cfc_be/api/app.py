from flask import Flask
from flask_cors import CORS

from cfc_be.api.cfc_api import create_backend_app
from cfc_be.api.cfc_api.extensions import Logger
from config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    loggerclass = Logger()
    logger = loggerclass.init_app(app)

    # Initialize backend app
    backend_app = create_backend_app()
    app.register_blueprint(backend_app)

    print(app.url_map)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
