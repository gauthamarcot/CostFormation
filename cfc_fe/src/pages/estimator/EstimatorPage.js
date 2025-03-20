import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaCalculator, FaPlus, FaChartLine, FaCode, FaSave, FaShare, FaDownload } from 'react-icons/fa';
import { mockTemplates } from '../../services/mockData';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ServiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ServiceItem = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 2px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const ServiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ServiceTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const ServiceIcon = styled.div`
  font-size: 2rem;
`;

const ServiceName = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const RemoveButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.error}10;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.error}20;
  }
`;

const ConfigurationSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ConfigItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ConfigLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  color: ${({ theme }) => theme.colors.textLight};
`;

const ConfigInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const ConfigSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const CostSummary = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border-top: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CostDetails = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const CostItem = styled.div`
  text-align: center;
`;

const CostLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CostValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const CalculateButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    transform: translateY(-2px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textLight};
`;

const ActionBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AddServiceButton = styled(ActionButton)`
  background: ${({ theme }) => theme.colors.primary}10;
  border-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
`;

const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.6;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Feature = styled.li`
  background: ${({ theme }) => theme.colors.primary}10;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  white-space: nowrap;
`;

const CostBreakdown = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const CostBreakdownTitle = styled.h3`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CostBreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CostBreakdownLabel = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
`;

const CostBreakdownValue = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const TemplateModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;

  @media (max-width: 768px) {
    width: 95%;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const TemplateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TemplateContent = styled.pre`
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow-x: auto;
  font-family: monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: ${({ theme }) => theme.typography.small.fontSize};

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const TemplateActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const DownloadButton = styled(ActionButton)`
  background: ${({ theme }) => theme.colors.success}10;
  border-color: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.success};
`;

const TemplateFormatSelect = styled(ConfigSelect)`
  min-width: 150px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TemplateControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.textLight};
  font-weight: ${({ active }) => active ? '600' : '400'};
  white-space: nowrap;
  
  &:not(:last-child)::after {
    content: '';
    flex: 1;
    height: 2px;
    background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.border};
    margin-left: ${({ theme }) => theme.spacing.md};

    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.sm};
    background: ${({ active, theme }) => active ? `${theme.colors.primary}10` : 'transparent'};
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

const EstimatorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState([]);
  const [configurations, setConfigurations] = useState({});
  const [totalCost, setTotalCost] = useState({ hourly: 0, monthly: 0 });
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [templateFormat, setTemplateFormat] = useState('yaml');
  const [currentStep, setCurrentStep] = useState(1); // 1: Services, 2: Configuration, 3: Review

  useEffect(() => {
    if (location.state?.service) {
      const newService = {
        ...location.state.service,
        provider: location.state.provider || 'azure'
      };
      setSelectedServices(prev => [...prev, newService]);
      setConfigurations(prev => ({
        ...prev,
        [newService.id]: {
          quantity: 1,
          region: 'us-east-1',
          instanceType: 't2.micro',
          storage: 100,
          bandwidth: 1000
        }
      }));
    }
  }, [location]);

  useEffect(() => {
    // Calculate total cost based on configurations
    const hourly = selectedServices.reduce((total, service) => {
      const config = configurations[service.id];
      if (!config) return total;
      return total + (service.pricing.hourly * config.quantity);
    }, 0);

    const monthly = selectedServices.reduce((total, service) => {
      const config = configurations[service.id];
      if (!config) return total;
      return total + (service.pricing.monthly * config.quantity);
    }, 0);

    setTotalCost({ hourly, monthly });
  }, [selectedServices, configurations]);

  const handleRemoveService = (serviceId) => {
    setSelectedServices(prev => prev.filter(service => service.id !== serviceId));
    setConfigurations(prev => {
      const newConfigs = { ...prev };
      delete newConfigs[serviceId];
      return newConfigs;
    });
  };

  const handleConfigChange = (serviceId, field, value) => {
    setConfigurations(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [field]: value
      }
    }));
  };

  const handleAddService = () => {
    // Get the provider from the last selected service or default to Azure
    const provider = selectedServices.length > 0 
      ? selectedServices[selectedServices.length - 1].provider 
      : 'azure';
    
    // Navigate to the appropriate provider page
    navigate(`/${provider}`);
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleGenerateTemplate = () => {
    const templates = [];
    
    selectedServices.forEach(service => {
      const config = configurations[service.id];
      if (!config) return;

      const provider = service.provider.toLowerCase();
      const templateData = mockTemplates[provider];
      
      if (templateData) {
        const providerTemplateType = provider === 'aws' ? 'cloudformation' : 
                                   provider === 'azure' ? 'arm' :
                                   provider === 'gcp' ? 'deployment' : 'terraform';
        
        let format = templateFormat;
        if (provider === 'aws' && format === 'bicep') format = 'yaml';
        if (provider === 'azure' && format === 'hcl') format = 'json';
        if (provider === 'gcp' && format === 'hcl') format = 'yaml';
        if (provider === 'oracle' && format === 'bicep') format = 'hcl';

        const template = {
          provider,
          service: service.name,
          format: format,
          content: templateData[providerTemplateType][format](service, config)
        };
        templates.push(template);
      }
    });

    if (templates.length === 0) {
      alert('No templates could be generated. Please check your service configurations.');
      return;
    }

    setCurrentTemplate(templates);
    setShowTemplate(true);
  };

  const handleDownloadTemplate = (template) => {
    const blob = new Blob([template.content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.provider}-${template.service}-template.${template.format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleSaveEstimate = () => {
    // TODO: Implement save functionality
    console.log('Saving estimate:', { selectedServices, configurations, totalCost });
  };

  const handleShareEstimate = () => {
    // TODO: Implement share functionality
    console.log('Sharing estimate:', { selectedServices, configurations, totalCost });
  };

  if (selectedServices.length === 0) {
    return (
      <PageContainer>
        <EmptyState>
          <h2>No Services Selected</h2>
          <p>Please go back and select some services to estimate costs.</p>
          <BackButton
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft /> Go Back
          </BackButton>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <BackButton
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowLeft /> Back to Services
        </BackButton>
        <Title>Cost Estimator</Title>
      </Header>

      {/* Step Indicator */}
      <StepIndicator>
        <Step active={currentStep >= 1}>1. Select Services</Step>
        <Step active={currentStep >= 2}>2. Configure Services</Step>
        <Step active={currentStep >= 3}>3. Review & Generate</Step>
      </StepIndicator>

      {/* Step 1: Service Selection */}
      {currentStep === 1 && (
        <>
          <ServiceList>
            <AnimatePresence>
              {selectedServices.map(service => (
                <ServiceItem
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ServiceHeader>
                    <ServiceTitle>
                      <ServiceIcon>{service.icon}</ServiceIcon>
                      <ServiceName>{service.name}</ServiceName>
                    </ServiceTitle>
                    <RemoveButton
                      onClick={() => handleRemoveService(service.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTrash />
                    </RemoveButton>
                  </ServiceHeader>
                  <ServiceDescription>{service.description}</ServiceDescription>
                  <FeaturesList>
                    {service.features.map((feature, index) => (
                      <Feature key={index}>{feature}</Feature>
                    ))}
                  </FeaturesList>
                </ServiceItem>
              ))}
            </AnimatePresence>
          </ServiceList>

          <ActionBar>
            <AddServiceButton
              onClick={handleAddService}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus /> Add Service
            </AddServiceButton>
            <ActionButton
              onClick={handleNextStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next: Configure Services
            </ActionButton>
          </ActionBar>
        </>
      )}

      {/* Step 2: Service Configuration */}
      {currentStep === 2 && (
        <>
          <ServiceList>
            {selectedServices.map(service => (
              <ServiceItem key={service.id}>
                <ServiceHeader>
                  <ServiceTitle>
                    <ServiceIcon>{service.icon}</ServiceIcon>
                    <ServiceName>{service.name}</ServiceName>
                  </ServiceTitle>
                </ServiceHeader>

                <ConfigurationSection>
                  <ConfigItem>
                    <ConfigLabel>Quantity</ConfigLabel>
                    <ConfigInput
                      type="number"
                      min="1"
                      value={configurations[service.id]?.quantity || 1}
                      onChange={(e) => handleConfigChange(service.id, 'quantity', parseInt(e.target.value))}
                    />
                  </ConfigItem>

                  <ConfigItem>
                    <ConfigLabel>Region</ConfigLabel>
                    <ConfigSelect
                      value={configurations[service.id]?.region || 'us-east-1'}
                      onChange={(e) => handleConfigChange(service.id, 'region', e.target.value)}
                    >
                      <option value="us-east-1">US East (N. Virginia)</option>
                      <option value="us-west-2">US West (Oregon)</option>
                      <option value="eu-west-1">EU (Ireland)</option>
                      <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                    </ConfigSelect>
                  </ConfigItem>

                  <ConfigItem>
                    <ConfigLabel>Instance Type</ConfigLabel>
                    <ConfigSelect
                      value={configurations[service.id]?.instanceType || 't2.micro'}
                      onChange={(e) => handleConfigChange(service.id, 'instanceType', e.target.value)}
                    >
                      <option value="t2.micro">t2.micro</option>
                      <option value="t2.small">t2.small</option>
                      <option value="t2.medium">t2.medium</option>
                      <option value="t2.large">t2.large</option>
                    </ConfigSelect>
                  </ConfigItem>

                  <ConfigItem>
                    <ConfigLabel>Storage (GB)</ConfigLabel>
                    <ConfigInput
                      type="number"
                      min="1"
                      value={configurations[service.id]?.storage || 100}
                      onChange={(e) => handleConfigChange(service.id, 'storage', parseInt(e.target.value))}
                    />
                  </ConfigItem>

                  <ConfigItem>
                    <ConfigLabel>Bandwidth (GB/month)</ConfigLabel>
                    <ConfigInput
                      type="number"
                      min="0"
                      value={configurations[service.id]?.bandwidth || 1000}
                      onChange={(e) => handleConfigChange(service.id, 'bandwidth', parseInt(e.target.value))}
                    />
                  </ConfigItem>
                </ConfigurationSection>
              </ServiceItem>
            ))}
          </ServiceList>

          <ActionBar>
            <ActionButton
              onClick={handlePreviousStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Previous: Select Services
            </ActionButton>
            <ActionButton
              onClick={handleNextStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next: Review & Generate
            </ActionButton>
          </ActionBar>
        </>
      )}

      {/* Step 3: Review & Generate */}
      {currentStep === 3 && (
        <>
          <CostBreakdown>
            <CostBreakdownTitle>Cost Summary</CostBreakdownTitle>
            {selectedServices.map(service => {
              const config = configurations[service.id];
              if (!config) return null;

              const hourlyCost = service.pricing.hourly * config.quantity;
              const monthlyCost = service.pricing.monthly * config.quantity;

              return (
                <CostBreakdownItem key={service.id}>
                  <CostBreakdownLabel>{service.name}</CostBreakdownLabel>
                  <CostBreakdownValue>
                    ${hourlyCost.toFixed(2)}/hr | ${monthlyCost.toFixed(2)}/mo
                  </CostBreakdownValue>
                </CostBreakdownItem>
              );
            })}
          </CostBreakdown>

          <TemplateControls>
            <TemplateFormatSelect
              value={templateFormat}
              onChange={(e) => {
                setTemplateFormat(e.target.value);
                handleGenerateTemplate();
              }}
            >
              {selectedServices[0]?.provider === 'aws' ? (
                <>
                  <option value="yaml">CloudFormation YAML</option>
                  <option value="json">CloudFormation JSON</option>
                </>
              ) : selectedServices[0]?.provider === 'azure' ? (
                <>
                  <option value="json">ARM JSON</option>
                  <option value="bicep">Bicep</option>
                </>
              ) : selectedServices[0]?.provider === 'gcp' ? (
                <>
                  <option value="yaml">Deployment Manager YAML</option>
                  <option value="json">Deployment Manager JSON</option>
                </>
              ) : (
                <>
                  <option value="hcl">Terraform HCL</option>
                  <option value="json">Terraform JSON</option>
                </>
              )}
            </TemplateFormatSelect>
          </TemplateControls>

          <ActionBar>
            <ActionButton
              onClick={handlePreviousStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Previous: Configure Services
            </ActionButton>
            <ActionButton
              onClick={handleGenerateTemplate}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCode /> Generate Template
            </ActionButton>
            <ActionButton
              onClick={handleSaveEstimate}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSave /> Save Estimate
            </ActionButton>
            <ActionButton
              onClick={handleShareEstimate}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShare /> Share
            </ActionButton>
          </ActionBar>
        </>
      )}

      {/* Template Modal */}
      {showTemplate && (
        <>
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTemplate(false)}
          />
          <TemplateModal
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TemplateHeader>
              <h2>Generated Templates</h2>
              <ActionButton onClick={() => setShowTemplate(false)}>
                Close
              </ActionButton>
            </TemplateHeader>
            
            {currentTemplate.map((template, index) => (
              <div key={index}>
                <h3>{template.provider.toUpperCase()} - {template.service}</h3>
                <TemplateContent>{template.content}</TemplateContent>
                <TemplateActions>
                  <DownloadButton
                    onClick={() => handleDownloadTemplate(template)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaDownload /> Download Template
                  </DownloadButton>
                </TemplateActions>
              </div>
            ))}
          </TemplateModal>
        </>
      )}
    </PageContainer>
  );
};

export default EstimatorPage; 