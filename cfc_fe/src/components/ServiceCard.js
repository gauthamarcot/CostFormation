import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Card = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  border: 1px solid ${({ theme }) => theme.colors.border};
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.h3.fontSize};
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-grow: 1;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  margin-right: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  cursor: pointer;
`;

const ServiceCard = ({ title, description, children, isSelected, onSelect }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Title>{title}</Title>
      <Description>{description}</Description>
      <CheckboxContainer>
        <Checkbox
          type="checkbox"
          id={title}
          checked={isSelected}
          onChange={onSelect}
        />
        <Label htmlFor={title}>Select Service</Label>
      </CheckboxContainer>
      {children}
    </Card>
  );
};

export default ServiceCard; 