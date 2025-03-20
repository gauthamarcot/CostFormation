// src/App.js
import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import React Router components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AwsPage from './pages/aws/AwsPage';
import styled from 'styled-components';
import AzurePage from './pages/azure/AzurePage';
import GcpPage from './pages/gcp/GcpPage';
import OraclePage from './pages/oracle/OraclePage';
import EstimatorPage from './pages/estimator/EstimatorPage';
import CodePage from './pages/iac/iac_generator';
import GlobalStyles from './styles/GlobalStyles';

const lightTheme = {
  colors: {
    primary: '#1a237e',
    primaryLight: '#534bae',
    primaryDark: '#000051',
    secondary: '#007bff',
    secondaryLight: '#4dabf7',
    secondaryDark: '#0056b3',
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#2d3436',
    textLight: '#636e72',
    error: '#d63031',
    success: '#00b894',
    border: '#dfe6e9',
    hover: '#f1f2f6',
    shadow: 'rgba(0, 0, 0, 0.1)',
    navBg: '#ffffff',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    small: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
};

const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    textLight: '#b0b0b0',
    border: '#333333',
    hover: '#2d2d2d',
    navBg: '#1e1e1e',
  },
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 70vh;
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xl};
`;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <ScrollToTop />
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <Container>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/aws" element={<AwsPage />} />
            <Route path="/azure" element={<AzurePage />} />
            <Route path="/gcp" element={<GcpPage />} />
            <Route path="/oracle" element={<OraclePage />} />
            <Route path="/estimator" element={<EstimatorPage />} />
            <Route path="/codegen" element={<CodePage />} />
          </Routes>
        </Container>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
