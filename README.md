# CostFormationCalculator

A multi-cloud resource cost calculator and deployment template generator.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Supported Cloud Providers](#supported-cloud-providers)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
  - [Contribution Guidelines](#contribution-guidelines)
- [License](#license)
- [Contact](#contact)
- [Roadmap](#roadmap)
- [Acknowledgements](#acknowledgements)
- [Disclaimer](#disclaimer)

## Introduction

**CostFormationCalculator** is an open-source tool that enables users to calculate the cost of cloud resources across multiple cloud providers and generate deployment templates based on their selections. It simplifies the process of planning, costing, and deploying cloud infrastructure by providing an intuitive interface and automating the generation of infrastructure-as-code templates.

## Features

- **Multi-Cloud Support**: Calculate costs and generate templates for AWS, Azure, GCP, Oracle Cloud, and IBM Cloud.
- **Real-Time Pricing Data**: Fetches the latest pricing information directly from cloud provider APIs.
- **User-Friendly Interface**: Intuitive forms and wizards to input resource requirements.
- **Cost Calculation**: Provides detailed cost estimates with breakdowns per resource.
- **Template Generation**: Automatically generates deployment templates:
  - **AWS**: CloudFormation templates (YAML/JSON)
  - **Azure**: ARM templates (JSON) or Bicep files
  - **GCP**: Deployment Manager templates (YAML/JSON)
  - **Oracle Cloud**: Resource Manager templates
  - **IBM Cloud**: Schematics templates
- **Best Practices**: Incorporates cloud provider best practices for security, scalability, and reliability.
- **Customization**: Allows users to customize and parameterize their deployment templates.
- **Open Source**: Community-driven project encouraging collaboration and contributions.

## Supported Cloud Providers

- **Amazon Web Services (AWS)**
- **Microsoft Azure**
- **Google Cloud Platform (GCP)**
- **Oracle Cloud**
- **IBM Cloud**

## Getting Started

### Prerequisites

- **Node.js** (version >= 14)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/CostFormationCalculator.git
   cd CostFormationCalculator
   ```
Install Dependencies

```
npm install
```
or

```
yarn install
```
Set Up Environment Variables

Create a .env file in the root directory and add any necessary environment variables (e.g., API keys for cloud provider pricing APIs).

dotenv
Copy code
### Example .env file
AWS_API_KEY=your_aws_api_key
AZURE_API_KEY=your_azure_api_key
GCP_API_KEY=your_gcp_api_key
Run the Application

```
npm start
```
or

```
yarn start
```
Access the Application

Open your web browser and navigate to http://localhost:3000.

### Usage
Select a Cloud Provider

On the home page, click on the icon of the cloud provider you wish to use.

Input Resource Requirements

Compute Instances: Specify instance type/family, storage options, network configurations, etc.
Databases: Choose database engine, instance size, storage, IOPS, etc.
Additional Services: Add other resources as needed (e.g., Load Balancers, Storage Buckets).
Calculate Costs

Click on the Calculate Cost button.
Review the detailed cost breakdown provided.
Generate Deployment Template

After reviewing costs, click on the Generate Template button.
Fill in any additional configuration details if prompted.
Download the generated template file.
Deploy Resources

Use your cloud provider's deployment tools to deploy the generated template.
For example, use AWS CloudFormation, Azure Resource Manager, or GCP Deployment Manager.
Contributing
We welcome contributions from the community! To contribute:

## Fork the Repository

Click on the Fork button at the top right corner of the repository page.

### Create a Feature Branch

```
git checkout -b feature/YourFeatureName
```
Commit Your Changes

```
git commit -m "Add your message here"
Push to Your Fork
```

```
git push origin feature/YourFeatureName
Create a Pull Request
```
### Go to your fork on GitHub.
- Click on Compare & pull request.
- Describe your changes and submit the pull request.
- Contribution Guidelines
- Code Style: Follow the existing coding style and conventions.
- Testing: Ensure that your changes do not break existing functionality.
- Documentation: Update documentation or comments where necessary.

### License
This project is licensed under the MIT License - see the LICENSE file for details.

Contact
Project Maintainer: Goutham Arcod (gouthamarcot@gmail.com)
GitHub Issues: https://github.com/yourusername/CostFormationCalculator/issues
Note: Replace yourusername with your actual GitHub username.

Roadmap
- Add Support for Additional Cloud Services
- Implement User Authentication
- Develop a RESTful API
- Enhance Cost Optimization Suggestions
- Integrate with CI/CD Pipelines
### Acknowledgements
Thanks to all contributors and the open-source community.
