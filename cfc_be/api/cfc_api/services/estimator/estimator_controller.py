from azure.core.rest import HttpRequest
from flask import jsonify

from cfc_be.api.cfc_api.services.estimator.aws_estimator import calculate_aws_cost, \
    get_aws_estimator
from cfc_be.api.cfc_api.services.estimator.azure_estimator import calculate_azure_cost, get_azure_pricing_data
from cfc_be.api.cfc_api.services.estimator.gcp_estimator import calculate_gcp_cost, get_gcp_pricing_data


def get_estimator_service_form(service, provider):
    try:
        if provider == 'aws':
            estimator_from = get_aws_estimator(service)
        elif provider == 'azure':
            estimator_from = get_azure_pricing_data(service)
        elif provider == 'gcp':
            estimator_from = get_gcp_pricing_data(service)
        else:
            raise ValueError("Invalid provider")
        return estimator_from
    except Exception as e:
        raise e


def estimator_controller(jobj):
    try:
        provider = jobj.get('provider')
        services = jobj.get('service')
        formated_services = [x.lower().replace(' ', '_') for x in services]
        if not provider or not services:
            raise ValueError("Missing provider or service")
        aws_services_form = get_estimator_service_form(formated_services, provider)
        if len(aws_services_form) == 0:
            raise ValueError("invalid provider or service")
        return aws_services_form, 200  # Return the response data and a 200 OK status code
    except (KeyError, ValueError) as e:
        return {"error": str(e)}, 400  # Return a 400 Bad Request error for invalid input
    except Exception as e:
        return {"error": f"Internal server error {e}"}, 500  # Return a 500 Internal Server Error for other exceptions


def cloud_calculator_controller(jobj):
    try:
        estimations = []
        for item in jobj:
            provider = item.get('provider')
            service = item.get('service')
            form_data = item.get('formData')

            if not provider or not service or not form_data:
                raise ValueError("Missing provider, service, or formData")
            # Calculate cost based on provider
            if provider == 'aws':
                cost = calculate_aws_cost(service, form_data)
            elif provider == 'azure':
                cost = calculate_azure_cost(service, form_data)
            elif provider == 'gcp':
                cost = calculate_gcp_cost(service, form_data)
            else:
                raise ValueError("Invalid provider")
            estimations.append({"provider": provider, "service": service, "cost": cost})
        return jsonify(estimations), 200
    except (KeyError, ValueError) as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500
