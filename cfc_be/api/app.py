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
    # upstox_feed.start()

    # Initialize backend app
    backend_app = create_backend_app()
    app.register_blueprint(backend_app)

    # Initialize frontend app
    frontend_app = create_frontend_app()
    app.register_blueprint(frontend_app)

    db.init_app(app)
    migrate.init_app(app, db)

    print(app.url_map)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
