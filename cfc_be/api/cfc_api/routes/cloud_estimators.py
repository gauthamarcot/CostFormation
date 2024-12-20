from flask import request
from flask_restx import Namespace, Resource

# from cfc_be.api.cfc_api.extensions import logger
from cfc_be.api.cfc_api.services.estimator.estimator_controller import estimator_controller, cloud_calculator_controller

api = Namespace('cloud_estimators', description='cloud estimators')


@api.route('/api/estimator')
class CloudEstimators(Resource):
    @api.doc('Cloud Estimators')
    def post(self):
        print(f"sending cloud estimators to {request.remote_addr}")
        data = request.json
        response, status = estimator_controller(data)
        return response, status


@api.route('/api/calculate_cost')
class CloudCalculateCost(Resource):
    @api.doc('Cloud Calculate Cost')
    def post(self):
        print(f"sending cloud estimators to {request.remote_addr}")
        data = request.get_json()
        response, status = cloud_calculator_controller(data)
        return response, status

