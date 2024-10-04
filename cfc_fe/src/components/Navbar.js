// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaSun, FaMoon, FaShareAlt } from 'react-icons/fa';
import logo from '../assets/logos/cloud_bw.png';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme.navBg};
  height: 100;
`;

const Logo = styled.div`
  img {
    height: 100px;
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;

  button {
    background: none;
    border: none;
    margin-left: 1rem;
    cursor: pointer;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.text};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;

  a {
    margin-left: 1rem;
    color: ${({ theme }) => theme.text};
    text-decoration: none;
  }
`;

const Navbar = ({ toggleTheme, isDarkMode }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'CostFormationCalculator',
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that do not support the Share API
      alert('Share feature is not supported in your browser.');
    }
  };

  return (
    <Nav> 
      <Logo>
        <Link to="/">
          <img src={logo} alt="Logo" width={100} height={100} />
        </Link>
      </Logo>
      <NavItems>
        <NavLinks>
          <Link to="/">Home</Link>
          <Link to="/aws">AWS</Link>
          <Link to="/azure">Azure</Link>
          <Link to="/gcp">GCP</Link>
          <Link to="/oracle">Oracle</Link>
        </NavLinks>
        <button onClick={toggleTheme}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button onClick={handleShare}>
          <FaShareAlt />
        </button>
      </NavItems>
    </Nav>
  );
};

export default Navbar;
