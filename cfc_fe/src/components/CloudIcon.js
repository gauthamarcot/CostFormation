// src/components/CloudIcon.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Import SVGs as React components
import { ReactComponent as AwsIcon } from '../assets/cld_lr/aws.svg';
import { ReactComponent as AzureIcon } from '../assets/cld_lr/azure.svg';
import { ReactComponent as GcpIcon } from '../assets/cld_lr/gcp.svg';
import { ReactComponent as OracleIcon } from '../assets/cld_lr/oracle.svg';

const IconWrapper = styled.div`
  position: relative;
  margin: 0 1rem;
  cursor: pointer;

  &:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
`;

const IconContainer = styled.div`
  width: 80px;
  height: auto;

  svg {
    width: 100%;
    height: auto;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.navBg};
  color: ${({ theme }) => theme.text};
  padding: 5px 10px;
  border-radius: 5px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s;
  white-space: nowrap;
`;

const iconComponents = {
  aws: AwsIcon,
  azure: AzureIcon,
  gcp: GcpIcon,
  oracle: OracleIcon,
};

const paths = {
  aws: '/aws',
  azure: '/azure',
  gcp: '/gcp',
  oracle: '/oracle',
};

const CloudIcon = ({ provider }) => {
  const IconComponent = iconComponents[provider];

  return (
    <IconWrapper>
      <Link to={paths[provider]}>
        <IconContainer>
          <IconComponent />
        </IconContainer>
        <Tooltip className="tooltip">Calculate Estimate &rarr;</Tooltip>
      </Link>
    </IconWrapper>
  );
};

export default CloudIcon;
