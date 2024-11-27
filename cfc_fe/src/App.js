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



const lightTheme = {
  navBg: '#ffffff',
  background: '#f0f0f0',
  text: '#000000',
};

const darkTheme = {
  navBg: '#333333',
  background: '#121212',
  text: '#ffffff',
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
`;

  return (
    <ThemeProvider theme={theme}>
      <Router> {/* Wrap your application in <Router> */}
        <ScrollToTop /> {/* Place inside <Router> to access routing context */}
          <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          <Container>
          <Routes> {/* Define your routes */}
            <Route path="/" element={<Hero />} />
            <Route path="/aws" element={<AwsPage />} />
            <Route path="/azure" element = {<AzurePage />} />
            <Route path="/gcp" element = {<GcpPage />} />
            <Route path="/oracle" element = {<OraclePage />} />
            {/* Add a NotFoundPage route if desired */}
          </Routes>
          </Container>
          <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
