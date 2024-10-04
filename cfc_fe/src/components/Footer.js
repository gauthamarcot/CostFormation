// src/components/Footer.js
import React from 'react';
import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa';
import bmc from '../assets/bmc-button.png'

const FooterContainer = styled.footer`
  text-align: center;
  padding: 1rem;
  background: ${({ theme }) => theme.navBg};
  color: ${({ theme }) => theme.text};
`;

const HeartIcon = styled(FaHeart)`
  color: red;
  margin: 0 5px;
`;

const SupportButton = styled.a`
  display: inline-block;
  margin-top: 1rem;
  img {
    height: 40px;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>
        &copy; {new Date().getFullYear()} Made with <HeartIcon /> by Indie Dev
      </p>
      <SupportButton
        href="https://buymeacoffee.com/gouthamarcp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={bmc} alt="Buy Me a Coffee" />
      </SupportButton>
    </FooterContainer>
  );
};

export default Footer;
