import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaServer, FaDatabase, FaNetworkWired, FaBox, FaCloud } from 'react-icons/fa';
import { mockServices } from '../../services/mockData';
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
  ServicePrice,
  ServiceFeatures,
  Feature
} from '../../components/CloudServiceStyles';

const GcpPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Services', icon: <FaCloud /> },
    { id: 'compute', name: 'Compute', icon: <FaServer /> },
    { id: 'database', name: 'Database', icon: <FaDatabase /> },
    { id: 'networking', name: 'Networking', icon: <FaNetworkWired /> },
    { id: 'storage', name: 'Storage', icon: <FaBox /> }
  ];

  // Get GCP services from mock data
  const gcpServices = mockServices.gcp || [];

  const filteredServices = gcpServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleServiceSelect = (service) => {
    navigate('/estimator', {
      state: {
        services: {
          ...service,
          id: `${service.name}-${Date.now()}`,
          quantity: 1,
          provider: 'gcp'
        }
      }
    });
  };

  return (
    <PageContainer>
      <Header>
        <Title>Google Cloud Platform</Title>
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
              <ServiceDescription>{service.description}</ServiceDescription>
              <ServicePrice>
                ${service.pricing.hourly}/hr | ${service.pricing.monthly}/mo
              </ServicePrice>
              <ServiceFeatures>
                {service.features.map((feature, index) => (
                  <Feature key={index}>{feature}</Feature>
                ))}
              </ServiceFeatures>
            </ServiceCard>
          ))}
        </AnimatePresence>
      </ServiceGrid>
    </PageContainer>
  );
};

export default GcpPage; 