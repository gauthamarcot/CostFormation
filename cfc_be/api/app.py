from flask import Flask
from flask_cors import CORS
from app_backend import create_backend_app, db, migrate
from app_backend.websockets.upstock_wss import upstox_feed
from app_frontend import create_frontend_app
from config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    # Initialize backend app
    backend_app = create_backend_app()
    app.register_blueprint(backend_app)

    print(app.url_map)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
