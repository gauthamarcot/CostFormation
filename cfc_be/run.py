"""Run the Cost Formation Calculator application."""
from cfc_be.api.app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True) 