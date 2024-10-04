// src/pages/AwsPage.js
import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 2rem;
  color: ${({ theme }) => theme.text};
`;

const AwsPage = () => {
  return (
    <PageContainer>
      <h1>AWS Cost Estimation</h1>
      {/* Add your AWS cost estimation form and logic here */}
    </PageContainer>
  );
};

export default AwsPage;
