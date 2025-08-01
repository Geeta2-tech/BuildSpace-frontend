import api from '../utils/api';
import { getUserFromToken } from '../utils/tokenStorage';

// Function to create a workspace
const createWorkspaceApi = async (name) => {

  // Get user data directly
  const currentUser = getUserFromToken();
  console.log('currentUser',currentUser);
  const userId = currentUser.userId;
  const data = {userId,name};
  console.log(data);
  console.log(userId);
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

// Example usage
export const handleWorkspaceCreation = async () => {
  try {
    await createWorkspace('My New Workspace');
  } catch (error) {
    console.error('Failed to create workspace:', error);
  }
};

export default createWorkspaceApi;