import axios from 'axios';

// Base API configuration
const BaseApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods
const api = {
  // POST request
  post: async ({ endpoint, data = {}, params = {}, headers = {} }) => {
    try {
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
  put: async ({ endpoint, data = {}, params = {}, headers = {} }) => {
    try {
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
        data, // Axios requires `data` for DELETE requests
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
