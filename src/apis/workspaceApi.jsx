import api from './utils/api';

// Function to create a workspace
const createWorkspace = async (name) => {
  
  const userId = '40ddd440-6935-4e80-87a3-c070d1bcea41';
  try {
    const response = await api.post({
      endpoint: '/workspace/create', // API endpoint
      name,
      userId, // Input data to send in the POST request
    });
    console.log('Workspace created:', response);
  } catch (error) {
    console.error('Error creating workspace:', error);
  }
};

// Call the createWorkspace function to execute the POST request
createWorkspace();
