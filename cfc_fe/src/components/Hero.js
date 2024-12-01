// src/components/Hero.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import CloudIcon from './CloudIcon';
import gifimg from '../assets/Mathematics-Formulas-Calculations.webp';

const HeroSection = styled.section`
  text-align: center;
  padding: 2rem;
  position: relative; /* To position the content over the background */
  z-index: 1; /* Ensure the content is above the background */
  height: 60vh;
`;

const AnimatedText = styled(motion.h1)`
  font-size: 2.5rem;
  color: #ffffff;
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const GifBackground = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover the entire container */
  z-index: -1; /* Place the GIF behind the content */
`;

const Hero = () => {
  return (
    <HeroSection>
      <GifBackground src={gifimg} alt="Background GIF" /> {/* Add the GIF here */}
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
