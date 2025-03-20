from azure.core.rest import HttpRequest
from flask import jsonify

from cfc_be.api.cfc_api.services.estimator.aws_estimator import calculate_aws_cost, \
    get_aws_estimator
from cfc_be.api.cfc_api.services.estimator.azure_estimator import calculate_azure_cost, get_azure_pricing_data
from cfc_be.api.cfc_api.services.estimator.gcp_estimator import calculate_gcp_cost, get_gcp_pricing_data
from cfc_be.api.cfc_api.services.estimator.oracle_estimator import calculate_oracle_cost


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


def estimator_controller(data):
    """Generate cost estimates for cloud services."""
    try:
        if not data.get('services'):
            raise ValueError("No services provided for estimation")

        estimates = []
        for service in data['services']:
            # Validate required fields
            required_fields = ['id', 'name', 'category', 'provider', 'quantity', 'region']
            if not all(field in service for field in required_fields):
                raise ValueError(f"Missing required fields for service {service.get('name', 'unknown')}")

            # Calculate base cost based on service configuration
            base_cost = {
                'aws': calculate_aws_cost,
                'azure': calculate_azure_cost,
                'gcp': calculate_gcp_cost,
                'oracle': calculate_oracle_cost
            }.get(service['provider'].lower())

            if not base_cost:
                raise ValueError(f"Unsupported provider: {service['provider']}")

            cost = base_cost(service)
            
            # Format the estimate response
            estimate = {
                'service': {
                    'id': service['id'],
                    'name': service['name'],
                    'category': service['category'],
                    'provider': service['provider'],
                    'region': service['region']
                },
                'configuration': {
                    'quantity': service['quantity'],
                    'instanceType': service.get('instanceType'),
                    'storage': service.get('storage'),
                    'bandwidth': service.get('bandwidth')
                },
                'costs': {
                    'hourly': cost['hourly'],
                    'monthly': cost['monthly'],
                    'yearly': cost['monthly'] * 12
                },
                'breakdown': {
                    'compute': cost.get('compute', 0),
                    'storage': cost.get('storage', 0),
                    'network': cost.get('network', 0),
                    'other': cost.get('other', 0)
                }
            }
            estimates.append(estimate)

        response = {
            'estimates': estimates,
            'summary': {
                'total_hourly': sum(e['costs']['hourly'] for e in estimates),
                'total_monthly': sum(e['costs']['monthly'] for e in estimates),
                'total_yearly': sum(e['costs']['yearly'] for e in estimates)
            }
        }

        return response, 200

    except ValueError as e:
        return {'error': str(e)}, 400
    except Exception as e:
        return {'error': f'Internal server error: {str(e)}'}, 500


def cloud_calculator_controller(data):
    """Calculate detailed costs for cloud services."""
    try:
        if not data.get('services'):
            raise ValueError("No services provided for calculation")

        calculations = []
        for service in data['services']:
            # Validate required fields
            required_fields = ['id', 'name', 'category', 'provider', 'quantity', 'region']
            if not all(field in service for field in required_fields):
                raise ValueError(f"Missing required fields for service {service.get('name', 'unknown')}")

            # Get the appropriate calculation function
            calculator = {
                'aws': calculate_aws_cost,
                'azure': calculate_azure_cost,
                'gcp': calculate_gcp_cost,
                'oracle': calculate_oracle_cost
            }.get(service['provider'].lower())

            if not calculator:
                raise ValueError(f"Unsupported provider: {service['provider']}")

            # Calculate costs
            cost = calculator(service)
            
            # Format the calculation response
            calculation = {
                'service': {
                    'id': service['id'],
                    'name': service['name'],
                    'category': service['category'],
                    'provider': service['provider'],
                    'region': service['region']
                },
                'configuration': {
                    'quantity': service['quantity'],
                    'instanceType': service.get('instanceType'),
                    'storage': service.get('storage'),
                    'bandwidth': service.get('bandwidth')
                },
                'costs': {
                    'hourly': cost['hourly'],
                    'monthly': cost['monthly'],
                    'yearly': cost['monthly'] * 12,
                    'details': {
                        'compute': {
                            'amount': cost.get('compute', 0),
                            'description': 'Compute instance costs'
                        },
                        'storage': {
                            'amount': cost.get('storage', 0),
                            'description': 'Storage costs'
                        },
                        'network': {
                            'amount': cost.get('network', 0),
                            'description': 'Network transfer costs'
                        },
                        'other': {
                            'amount': cost.get('other', 0),
                            'description': 'Additional service costs'
                        }
                    }
                },
                'recommendations': [
                    {
                        'type': 'cost_optimization',
                        'description': 'Consider reserved instances for long-term usage',
                        'potential_savings': '30-60%'
                    },
                    {
                        'type': 'performance',
                        'description': 'Current configuration is optimal for your workload',
                        'impact': 'high'
                    }
                ]
            }
            calculations.append(calculation)

        response = {
            'calculations': calculations,
            'summary': {
                'total_hourly': sum(c['costs']['hourly'] for c in calculations),
                'total_monthly': sum(c['costs']['monthly'] for c in calculations),
                'total_yearly': sum(c['costs']['yearly'] for c in calculations),
                'by_provider': {},
                'by_category': {}
            }
        }

        # Calculate totals by provider and category
        for calc in calculations:
            provider = calc['service']['provider']
            category = calc['service']['category']
            
            if provider not in response['summary']['by_provider']:
                response['summary']['by_provider'][provider] = {
                    'monthly': 0,
                    'services_count': 0
                }
            if category not in response['summary']['by_category']:
                response['summary']['by_category'][category] = {
                    'monthly': 0,
                    'services_count': 0
                }
            
            response['summary']['by_provider'][provider]['monthly'] += calc['costs']['monthly']
            response['summary']['by_provider'][provider]['services_count'] += 1
            response['summary']['by_category'][category]['monthly'] += calc['costs']['monthly']
            response['summary']['by_category'][category]['services_count'] += 1

        return response, 200

    except ValueError as e:
        return {'error': str(e)}, 400
    except Exception as e:
        return {'error': f'Internal server error: {str(e)}'}, 500
