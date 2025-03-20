import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const ServiceGrid = ({ children }) => {
  return (
    <Grid
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </Grid>
  );
};

export default ServiceGrid; 