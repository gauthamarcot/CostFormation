// src/components/Hero.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import CloudIcon from './CloudIcon';

const HeroSection = styled.section`
  text-align: center;
  padding: 2rem;
`;

const AnimatedText = styled(motion.h1)`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.text};
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const Hero = () => {
  return (
    <HeroSection>
      <AnimatedText
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Calculate Your Cloud Costs Effortlessly
      </AnimatedText>
      <IconsContainer>
        <CloudIcon provider="aws" />
        <CloudIcon provider="azure" />
        <CloudIcon provider="gcp" />
        <CloudIcon provider="oracle" />
      </IconsContainer>
    </HeroSection>
  );
};

export default Hero;
