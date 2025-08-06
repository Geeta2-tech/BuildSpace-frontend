import api from '../utils/api';

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

const getAllWorkspaceMembers = async (workspaceId) => {
  try {
    const response = await api.get({
      endpoint: `/workspace/get-all-members?workspaceId=${workspaceId}`,
    });
    return response;
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    throw error;
  }
};

const removeAMember = async (workspaceId, userId) => {
  try {
    const response = await api.delete({
      endpoint: `/workspace/remove-members?workspaceId=${workspaceId}&userId=${userId}`,
    });
    return response;
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    throw error;
  }
};

const deleteWorkspace = async (workspaceId) => {
  try {
    const response = await api.delete({
      endpoint: `/workspace/delete?workspaceId=${workspaceId}`,
    });
    return response;
  } catch (error) {
    console.error('Error deleting workspace:', error);
    throw error;
  }
};

export {
  createWorkspaceApi,
  getAllWorkspaces,
  getAllWorkspaceMembers,
  removeAMember,
  deleteWorkspace,
};
