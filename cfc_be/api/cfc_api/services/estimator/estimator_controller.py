from azure.core.rest import HttpRequest
from flask import jsonify

from cfc_be.api.cfc_api.services.estimator.aws_estimator import get_aws_pricing_data, calculate_aws_cost
from cfc_be.api.cfc_api.services.estimator.azure_estimator import calculate_azure_cost, get_azure_pricing_data
from cfc_be.api.cfc_api.services.estimator.gcp_estimator import calculate_gcp_cost, get_gcp_pricing_data


def get_pricing_data(provider, service):
    try:
        if provider == 'aws':
            pricing_data = get_aws_pricing_data(service)
        elif provider == 'azure':
            pricing_data = get_azure_pricing_data(service)
        elif provider == 'gcp':
            pricing_data = get_gcp_pricing_data(service)
        else:
            raise ValueError("Invalid provider")
        return pricing_data
    except Exception as e:
        raise e



def estimator_controller(jobj):
    try:
        provider = jobj.get('provider')
        service = jobj.get('service')

        if not provider or not service:
            raise ValueError("Missing provider or service")

        # Access pricing data from your pricing collections
        pricing_data = get_pricing_data(provider, service)

        # Example: Construct form fields dynamically based on pricing data
        form_fields = []
        for field_name, field_data in pricing_data.items():
            field = {
                "type": field_data.get("type", "text"),  # Default to "text" if type is not specified
                "label": field_data.get("label", field_name),  # Use field_name as label if not specified
                "name": field_name
            }
            if field["type"] == "select":
                field["options"] = field_data.get("options", [])
            form_fields.append(field)

        response_data = {
            "provider": provider,
            "service": service,
            "formFields": form_fields
        }
        return response_data, 200  # Return the response data and a 200 OK status code

    except (KeyError, ValueError) as e:
        return {"error": str(e)}, 400  # Return a 400 Bad Request error for invalid input
    except Exception as e:
        return {"error": "Internal server error"}, 500  # Return a 500 Internal Server Error for other exceptions


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