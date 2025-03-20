import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.h1.fontSize};
    font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
    line-height: ${({ theme }) => theme.typography.h1.lineHeight};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.h2.fontSize};
    font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
    line-height: ${({ theme }) => theme.typography.h2.lineHeight};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.h3.fontSize};
    font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
    line-height: ${({ theme }) => theme.typography.h3.lineHeight};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.textLight};
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
    font-size: ${({ theme }) => theme.typography.body.fontSize};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primaryLight};
    }
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};

    &:hover {
      background: ${({ theme }) => theme.colors.textLight};
    }
  }
`;

export default GlobalStyles; 