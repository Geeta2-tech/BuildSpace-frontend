import api from '../utils/api';
import { getUserFromToken } from '../utils/tokenStorage';

// Function to create a workspace
const createWorkspaceApi = async (name) => {
  const data = { name };
  try {
    const response = await api.post({
      endpoint: '/workspace/create',
      data,
    });
    console.log('Workspace created:', response);
    return response;
  } catch (error) {
    console.error('Error creating workspace:', error);
    throw error;
  }
};

const getAllWorkspaces = async () => {
  try {
    const response = await api.get({
      endpoint: '/workspace/get-all',
    });
    return response;
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    throw error;
  }
};

export { createWorkspaceApi, getAllWorkspaces };
