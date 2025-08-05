import api from '../utils/api'; // Adjust the import path

// Create Page
const createPage = async (title, workspaceId, content = '') => {
  const pageData = {
    title: title,
    workspaceId: workspaceId,
    parentPageId: null,
    content: content, // Add content field
  };

  try {
    const response = await api.post({
      endpoint: '/page/create',
      data: pageData,
    });
    console.log('Page created:', response);
    return response;
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
};

// Get Page by ID
const getPageById = async (pageId) => {
  try {
    const response = await api.get({
      endpoint: '/page/get-by-id',
      params: { pageId },
    });
    console.log('Page details:', response);
    return response;
  } catch (error) {
    console.error('Error fetching page by ID:', error);
    throw error;
  }
};

// Get Pages by Workspace ID
const getPagesByWorkspaceId = async (workspaceId) => {
  try {
    const response = await api.get({
      endpoint: '/page/get-all',
      params: { workspaceId },
    });
    console.log('Pages in workspace:', response);
    return response;
  } catch (error) {
    console.error('Error fetching pages by workspace ID:', error);
    throw error;
  }
};

// Update Page by Page ID - Updated to accept pageId and updatedData parameters
const updatePage = async (pageId, updatedData) => {
  try {
    const response = await api.put({
      endpoint: '/page/update',
      data: updatedData,
      params: { pageId },
    });
    console.log('Page updated:', response);
    return response;
  } catch (error) {
    console.error('Error updating page:', error);
    throw error;
  }
};

// Delete Page by Page ID
const deletePage = async (pageId) => {
  try {
    const response = await api.delete({
      endpoint: '/page/delete',
      params: { pageId },
    });
    console.log('Page deleted:', response);
    return response;
  } catch (error) {
    console.error('Error deleting page:', error);
    throw error;
  }
};

export {
  createPage,
  getPageById,
  getPagesByWorkspaceId,
  updatePage,
  deletePage
};