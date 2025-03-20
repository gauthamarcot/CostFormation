import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/cfc/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const serviceApi = {
  // Get all available services
  getServices: async () => {
    try {
      const response = await api.get('/services');
      return response.data.services;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  // Calculate costs for services
  calculateCosts: async (services) => {
    try {
      const response = await api.post('/calculator/calculate', { services });
      return response.data;
    } catch (error) {
      console.error('Error calculating costs:', error);
      throw error;
    }
  },

  // Generate IaC template
  generateTemplate: async (services, format, provider) => {
    try {
      const response = await api.post('/iac/generate', {
        services,
        format,
        provider
      });
      return response.data;
    } catch (error) {
      console.error('Error generating template:', error);
      throw error;
    }
  }
}; 