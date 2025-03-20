import React from 'react';
import CloudServicePage from '../../components/CloudServicePage';
import { useNavigate } from 'react-router-dom';

const AzurePage = () => {
  const navigate = useNavigate();

  const handleServiceSelect = (service) => {
    navigate('/estimator', {
      state: {
        service: {
          ...service,
          provider: 'azure',
          type: getServiceType(service.name)
        }
      }
    });
  };

  const getServiceType = (serviceName) => {
    const typeMap = {
      'Virtual Machine': 'Compute',
      'Azure SQL Database': 'Sql',
      'Blob Storage': 'Storage',
      'Virtual Network': 'Network'
    };
    return typeMap[serviceName] || 'Resource';
  };

  return (
    <CloudServicePage
      provider="azure"
      title="Microsoft Azure Services"
    />
  );
};

export default AzurePage; 