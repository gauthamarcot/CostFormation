from flask_restx import Namespace, Resource



api = Namespace('cp_service', description='Cloud service list api related operations')

@api.route('/cp_service')
class CpServiceList(Resource):
    @api.doc('cp_service_list')
    def get(self):
