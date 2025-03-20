// Mock data for cloud services
export const mockServices = {
  azure: [
    {
      id: 'vm-1',
      name: 'Virtual Machine',
      category: 'Compute',
      description: 'Scalable computing resources with flexible pricing options',
      pricing: {
        hourly: 0.05,
        monthly: 36.50
      },
      features: ['Auto-scaling', 'High availability', 'Managed disks'],
      icon: '🖥️'
    },
    {
      id: 'db-1',
      name: 'Azure SQL Database',
      category: 'Database',
      description: 'Managed SQL database with built-in intelligence',
      pricing: {
        hourly: 0.15,
        monthly: 109.50
      },
      features: ['Automatic tuning', 'Advanced security', 'Built-in backup'],
      icon: '🗄️'
    },
    {
      id: 'storage-1',
      name: 'Blob Storage',
      category: 'Storage',
      description: 'Massively scalable object storage for any type of data',
      pricing: {
        hourly: 0.02,
        monthly: 14.60
      },
      features: ['Hot/Cool/Archive tiers', 'Global distribution', 'CDN integration'],
      icon: '💾'
    },
    {
      id: 'network-1',
      name: 'Virtual Network',
      category: 'Networking',
      description: 'Private and isolated network infrastructure',
      pricing: {
        hourly: 0.01,
        monthly: 7.30
      },
      features: ['VPN Gateway', 'Load Balancer', 'Network Security Groups'],
      icon: '🌐'
    }
  ],
  aws: [
    {
      id: 'ec2-1',
      name: 'Amazon EC2',
      category: 'Compute',
      description: 'Resizable compute capacity in the cloud',
      pricing: {
        hourly: 0.08,
        monthly: 58.40
      },
      features: ['Auto Scaling', 'Load Balancing', 'Spot Instances'],
      icon: '🖥️'
    },
    {
      id: 'rds-1',
      name: 'Amazon RDS',
      category: 'Database',
      description: 'Managed relational database service',
      pricing: {
        hourly: 0.12,
        monthly: 87.60
      },
      features: ['Multi-AZ deployment', 'Automated backups', 'Read replicas'],
      icon: '🗄️'
    },
    {
      id: 's3-1',
      name: 'Amazon S3',
      category: 'Storage',
      description: 'Object storage with industry-leading scalability',
      pricing: {
        hourly: 0.02,
        monthly: 14.60
      },
      features: ['Lifecycle policies', 'Cross-region replication', 'Versioning'],
      icon: '💾'
    },
    {
      id: 'vpc-1',
      name: 'Amazon VPC',
      category: 'Networking',
      description: 'Isolated cloud resources',
      pricing: {
        hourly: 0.01,
        monthly: 7.30
      },
      features: ['VPN connection', 'Direct Connect', 'NAT Gateway'],
      icon: '🌐'
    }
  ],
  gcp: [
    {
      id: 'gce-1',
      name: 'Compute Engine',
      category: 'Compute',
      description: 'High-performance virtual machines',
      pricing: {
        hourly: 0.06,
        monthly: 43.80
      },
      features: ['Preemptible VMs', 'Sustained use discounts', 'Live migration'],
      icon: '🖥️'
    },
    {
      id: 'cloudsql-1',
      name: 'Cloud SQL',
      category: 'Database',
      description: 'Fully managed database service',
      pricing: {
        hourly: 0.10,
        monthly: 73.00
      },
      features: ['Automatic backups', 'High availability', 'Point-in-time recovery'],
      icon: '🗄️'
    },
    {
      id: 'gcs-1',
      name: 'Cloud Storage',
      category: 'Storage',
      description: 'Unified object storage',
      pricing: {
        hourly: 0.02,
        monthly: 14.60
      },
      features: ['Multi-regional', 'Nearline/Coldline', 'Lifecycle management'],
      icon: '💾'
    },
    {
      id: 'vpc-1',
      name: 'VPC',
      category: 'Networking',
      description: 'Private network infrastructure',
      pricing: {
        hourly: 0.01,
        monthly: 7.30
      },
      features: ['Cloud VPN', 'Cloud NAT', 'Firewall rules'],
      icon: '🌐'
    }
  ],
  oracle: [
    {
      id: 'oci-1',
      name: 'OCI Compute',
      category: 'Compute',
      description: 'High-performance compute instances',
      pricing: {
        hourly: 0.07,
        monthly: 51.10
      },
      features: ['Bare metal', 'Dedicated hosts', 'Autoscaling'],
      icon: '🖥️'
    },
    {
      id: 'autonomous-1',
      name: 'Autonomous Database',
      category: 'Database',
      description: 'Self-driving database service',
      pricing: {
        hourly: 0.13,
        monthly: 94.90
      },
      features: ['Autonomous tuning', 'Automatic scaling', 'Always free tier'],
      icon: '🗄️'
    },
    {
      id: 'object-1',
      name: 'Object Storage',
      category: 'Storage',
      description: 'Durable and scalable storage',
      pricing: {
        hourly: 0.02,
        monthly: 14.60
      },
      features: ['Archive storage', 'Cross-region replication', 'Lifecycle management'],
      icon: '💾'
    },
    {
      id: 'network-1',
      name: 'Virtual Cloud Network',
      category: 'Networking',
      description: 'Software-defined networking',
      pricing: {
        hourly: 0.01,
        monthly: 7.30
      },
      features: ['VPN Connect', 'FastConnect', 'Security lists'],
      icon: '🌐'
    }
  ]
};

// Mock API service
export const apiService = {
  async getServices(provider) {
    try {
      // In a real application, this would be an API call
      // const response = await fetch(`/api/${provider}/services`);
      // const data = await response.json();
      // return data;
      
      // For now, return mock data
      return mockServices[provider];
    } catch (error) {
      console.error('Error fetching services:', error);
      return mockServices[provider]; // Fallback to mock data
    }
  }
};

export const mockTemplates = {
  aws: {
    cloudformation: {
      yaml: (service, config) => `AWSTemplateFormatVersion: '2010-09-09'
Description: 'AWS CloudFormation Template for ${service.name}'

Parameters:
  EnvironmentName:
    Description: Environment name
    Type: String
    Default: dev

Resources:
  ${service.name.replace(/\s+/g, '')}:
    Type: AWS::${service.type || 'EC2::Instance'}
    Properties:
      Environment: !Ref EnvironmentName
      InstanceType: ${config.instanceType}
      StorageSize: ${config.storage}
      Bandwidth: ${config.bandwidth}`,
      json: (service, config) => `{
        "AWSTemplateFormatVersion": "2010-09-09",
        "Description": "AWS CloudFormation Template for ${service.name}",
        "Parameters": {
          "EnvironmentName": {
            "Description": "Environment name",
            "Type": "String",
            "Default": "dev"
          }
        },
        "Resources": {
          "${service.name.replace(/\s+/g, '')}": {
            "Type": "AWS::${service.type || 'EC2::Instance'}",
            "Properties": {
              "Environment": { "Ref": "EnvironmentName" },
              "InstanceType": "${config.instanceType}",
              "StorageSize": ${config.storage},
              "Bandwidth": ${config.bandwidth}
            }
          }
        }
      }`
    }
  },
  azure: {
    arm: {
      json: (service, config) => `{
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
          "environmentName": {
            "type": "string",
            "defaultValue": "dev"
          }
        },
        "resources": [
          {
            "type": "Microsoft.${service.type}",
            "name": "${service.name}",
            "apiVersion": "2021-04-01",
            "properties": {
              "environment": "[parameters('environmentName')]",
              "instanceType": "${config.instanceType}",
              "storageSize": ${config.storage},
              "bandwidth": ${config.bandwidth}
            }
          }
        ]
      }`,
      bicep: (service, config) => `param environmentName string = 'dev'

resource ${service.name} 'Microsoft.${service.type}@2021-04-01' = {
  name: '${service.name}'
  properties: {
    environment: environmentName
    instanceType: '${config.instanceType}'
    storageSize: ${config.storage}
    bandwidth: ${config.bandwidth}
  }
}`
    }
  },
  gcp: {
    deployment: {
      yaml: (service, config) => `resources:
- name: ${service.name}
  type: gcp-types/${service.type}-v1:${service.type}
  properties:
    environment: ${config.environment}
    instanceType: ${config.instanceType}
    storageSize: ${config.storage}
    bandwidth: ${config.bandwidth}`,
      json: (service, config) => `{
        "resources": [
          {
            "name": "${service.name}",
            "type": "gcp-types/${service.type}-v1:${service.type}",
            "properties": {
              "environment": "${config.environment}",
              "instanceType": "${config.instanceType}",
              "storageSize": ${config.storage},
              "bandwidth": ${config.bandwidth}
            }
          }
        ]
      }`
    }
  },
  oracle: {
    terraform: {
      hcl: (service, config) => `resource "oci_${service.type}" "${service.name}" {
  compartment_id = var.compartment_id
  display_name   = "${service.name}"
  instance_type = "${config.instanceType}"
  storage_size  = ${config.storage}
  bandwidth     = ${config.bandwidth}
}`,
      json: (service, config) => `{
        "resource": {
          "oci_${service.type}": {
            "${service.name}": {
              "compartment_id": "var.compartment_id",
              "display_name": "${service.name}",
              "instance_type": "${config.instanceType}",
              "storage_size": ${config.storage},
              "bandwidth": ${config.bandwidth}
            }
          }
        }
      }`
    }
  }
}; 