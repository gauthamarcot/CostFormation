const theme = {
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

export default theme; 