// src/components/Hero.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaAws, FaMicrosoft, FaGoogle, FaDatabase } from 'react-icons/fa';

const HeroContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background} 0%, ${({ theme }) => theme.colors.surface} 100%);
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  max-width: 800px;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  max-width: 600px;
`;

const CloudGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  max-width: 1200px;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const CloudCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 2px solid ${({ theme }) => theme.colors.border};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CloudIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme, provider }) => {
    switch (provider) {
      case 'aws': return '#FF9900';
      case 'azure': return '#008AD7';
      case 'gcp': return '#4285F4';
      case 'oracle': return '#F80000';
      default: return theme.colors.primary;
    }
  }};
`;

const CloudTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CloudDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  line-height: 1.6;
`;

const Hero = () => {
  const navigate = useNavigate();

  const cloudProviders = [
    {
      id: 'aws',
      name: 'Amazon Web Services',
      description: 'Comprehensive cloud computing platform offering over 200 fully featured services.',
      icon: <FaAws />,
      path: '/aws'
    },
    {
      id: 'azure',
      name: 'Microsoft Azure',
      description: 'Cloud computing platform for building, testing, deploying, and managing applications.',
      icon: <FaMicrosoft />,
      path: '/azure'
    },
    {
      id: 'gcp',
      name: 'Google Cloud Platform',
      description: 'Suite of cloud computing services running on the same infrastructure as Google.',
      icon: <FaGoogle />,
      path: '/gcp'
    },
    {
      id: 'oracle',
      name: 'Oracle Cloud',
      description: 'Cloud computing services offered by Oracle Corporation.',
      icon: <FaDatabase />,
      path: '/oracle'
    }
  ];

  return (
    <HeroContainer>
      <Title
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Cloud Cost Formation Calculator
      </Title>
      <Subtitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Calculate and compare costs across multiple cloud providers to make informed decisions for your infrastructure.
      </Subtitle>
      <CloudGrid>
        {cloudProviders.map((provider, index) => (
          <CloudCard
            key={provider.id}
            onClick={() => navigate(provider.path)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CloudIcon provider={provider.id}>
              {provider.icon}
            </CloudIcon>
            <CloudTitle>{provider.name}</CloudTitle>
            <CloudDescription>{provider.description}</CloudDescription>
          </CloudCard>
        ))}
      </CloudGrid>
    </HeroContainer>
  );
};

export default Hero;
