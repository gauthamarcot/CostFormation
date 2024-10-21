from flask import request
from flask_restx import Namespace, Resource

from cfc_be.api.cfc_api.extensions import logger
from cfc_be.api.cfc_api.services.aws_service import aws_services_list

api = Namespace('oracle_routes', description='Cloud service list api related operations')
