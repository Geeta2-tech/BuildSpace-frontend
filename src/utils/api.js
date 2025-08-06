import axios from 'axios';

// Base API configuration
const BaseApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api',
  withCredentials: true,
  // Default headers are removed from here to be set dynamically
});

// API methods
const api = {
  // POST request
  post: async ({ endpoint, data = {}, params = {} }) => {
    try {
      // **MODIFICATION**: Dynamically set headers
      const headers = {};
      // If the data is NOT FormData, set the Content-Type to application/json
      if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }
      // For FormData, we let the browser set the Content-Type with the correct boundary

      const response = await BaseApi.post(endpoint, data, {
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  },

  // GET request
  get: async ({ endpoint, params = {}, headers = {} }) => {
    try {
      const response = await BaseApi.get(endpoint, {
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  },

  // PUT request
  put: async ({ endpoint, data = {}, params = {} }) => {
    try {
      // **MODIFICATION**: Dynamically set headers
      const headers = {};
      if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await BaseApi.put(endpoint, data, {
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  },

  // DELETE request
  delete: async ({ endpoint, data = {}, params = {}, headers = {} }) => {
    try {
      const response = await BaseApi.delete(endpoint, {
        data,
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  },
};

export default api;
