import api from '../utils/api';

const createWorkspaceApi = async (name) => {
  try {
    const response = await api.post({
      endpoint: '/workspace/create',
      data: { name },
    });
    return response;
  } catch (error) {
    console.error('Error creating workspace:', error);
    throw error;
  }
};

const getAllWorkspacesApi = async () => {
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

const deleteWorkspaceApi = async (workspaceId) => {
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

const getAllWorkspaceMembersApi = async (workspaceId) => {
  try {
    const response = await api.get({
      endpoint: `/workspace/get-all-members?workspaceId=${workspaceId}`,
    });
    return response;
  } catch (error) {
    console.error('Error fetching workspace members:', error);
    throw error;
  }
};

const removeAMemberApi = async (workspaceId, userId) => {
  try {
    const response = await api.delete({
      endpoint: `/workspace/remove-members/?workspaceId=${workspaceId}&userId=${userId}`,
    });
    return response;
  } catch (error) {
    console.error('Error removing member:', error);
    throw error;
  }
};

// --- Invitation Management ---

const inviteMembersApi = async (workspaceId, members, message) => {
  try {
    const response = await api.post({
      endpoint: `/workspace/invite-members?workspaceId=${workspaceId}`,
      data: { members, message },
    });
    return response;
  } catch (error) {
    console.error('Error sending invitations:', error);
    throw error;
  }
};

const getPendingInvitationsApi = async () => {
  try {
    const response = await api.get({
      endpoint: '/workspace/pending-invitations',
    });
    return response;
  } catch (error) {
    console.error('Error fetching pending invitations:', error);
    throw error;
  }
};

const getInvitationDetailsApi = async (token) => {
  try {
    // This is an unprotected route, so we call it directly
    const response = await api.get({
      endpoint: `/workspace/get-invitation-details?token=${token}`,
    });
    return response;
  } catch (error) {
    console.error('Error fetching invitation details:', error);
    throw error;
  }
};

const acceptInvitationApi = async (token) => {
  try {
    const response = await api.post({
      endpoint: '/workspace/accept-invitation',
      data: { token },
    });
    return response;
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
};

const declineInvitationApi = async (token) => {
  try {
    const response = await api.post({
      endpoint: '/workspace/decline-invitation',
      data: { token },
    });
    return response;
  } catch (error) {
    console.error('Error declining invitation:', error);
    throw error;
  }
};

export {
  createWorkspaceApi,
  getAllWorkspacesApi,
  deleteWorkspaceApi,
  getAllWorkspaceMembersApi,
  removeAMemberApi,
  inviteMembersApi,
  getPendingInvitationsApi,
  acceptInvitationApi,
  declineInvitationApi,
  getInvitationDetailsApi,
};
