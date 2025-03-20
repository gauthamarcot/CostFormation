import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { serviceApi } from '../services/api';
import { FaSearch, FaServer, FaDatabase, FaNetworkWired, FaBox, FaCloud } from 'react-icons/fa';
import {
  PageContainer,
  Header,
  Title,
  SearchBar,
  SearchInput,
  CategoryFilters,
  CategoryButton,
  ServiceGrid,
  ServiceCard,
  ServiceHeader,
  ServiceIcon,
  ServiceName,
  ServiceDescription,
  ServiceFeatures,
  Feature
} from './CloudServiceStyles';

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing.md};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
`;

const LoadingSpinner = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.primary}20;
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: auto;
  margin-top: ${({ theme }) => theme.spacing.xl};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ServicePricing = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const CloudServicePage = ({ provider, title }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: 'All Services', icon: <FaCloud /> },
    { id: 'compute', name: 'Compute', icon: <FaServer /> },
    { id: 'database', name: 'Database', icon: <FaDatabase /> },
    { id: 'networking', name: 'Networking', icon: <FaNetworkWired /> },
    { id: 'storage', name: 'Storage', icon: <FaBox /> }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await serviceApi.getServices();
        // Filter services by provider and ensure they have the required properties
        const providerServices = data
          .filter(service => service.provider === provider)
          .map(service => ({
            ...service,
            pricing: service.pricing || { hourly: 'Contact us', monthly: 'Contact us' },
            features: service.features || [],
            icon: getCategoryIcon(service.category)
          }));
        setServices(providerServices);
      } catch (err) {
        setError('Failed to fetch services. Please try again.');
        console.error('Error fetching services:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [provider]);

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'compute':
        return <FaServer />;
      case 'database':
        return <FaDatabase />;
      case 'networking':
        return <FaNetworkWired />;
      case 'storage':
        return <FaBox />;
      default:
        return <FaCloud />;
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (service.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleServiceSelect = (service) => {
    // Create a clean service object without React elements
    const cleanService = {
      id: `${service.name}-${Date.now()}`,
      name: service.name,
      description: service.description,
      category: service.category,
      provider: provider,
      quantity: 1,
      pricing: service.pricing,
      features: service.features
    };

    navigate('/estimator', {
      state: {
        services: cleanService
      }
    });
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? `$${price}` : price;
  };

  return (
    <PageContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Header>
            <Title>{title}</Title>
          </Header>

          <SearchBar>
            <FaSearch />
            <SearchInput
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>

          <CategoryFilters>
            {categories.map(category => (
              <CategoryButton
                key={category.id}
                active={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.icon} {category.name}
              </CategoryButton>
            ))}
          </CategoryFilters>

          <ServiceGrid>
            <AnimatePresence>
              {filteredServices.map(service => (
                <ServiceCard
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ServiceHeader>
                    <ServiceIcon>{service.icon}</ServiceIcon>
                    <ServiceName>{service.name}</ServiceName>
                  </ServiceHeader>
                  <ServiceDescription>
                    {service.description || 'No description available'}
                  </ServiceDescription>
                  <ServicePricing>
                    {formatPrice(service.pricing.hourly)}/hr | {formatPrice(service.pricing.monthly)}/mo
                  </ServicePricing>
                  {service.features && service.features.length > 0 && (
                    <ServiceFeatures>
                      {service.features.map((feature, index) => (
                        <Feature key={index}>{feature}</Feature>
                      ))}
                    </ServiceFeatures>
                  )}
                </ServiceCard>
              ))}
            </AnimatePresence>
          </ServiceGrid>
        </>
      )}
    </PageContainer>
  );
};

export default CloudServicePage; 