
// Updated WorkspaceContext with role checking utilities
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import { useNavigate } from 'react-router-dom';
import {
  getAllWorkspaceMembersApi,
  getAllWorkspacesApi,
  deleteWorkspaceApi,
  getPendingInvitationsApi,
  acceptInvitationApi,
  declineInvitationApi,
  removeAMemberApi,
  createWorkspaceApi,
} from '../apis/workspaceApi';
import { logoutUserApi, getCurrentUserApi } from '../apis/authApi';
import toast from 'react-hot-toast';

const clearCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [workspaces, setWorkspaces] = useState({
    owned: [],
    shared: [],
  });
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const navigate = useNavigate();

  // Role checking utilities
  const currentUserRole = useMemo(() => {
    if (!currentUser || !activeWorkspace || !workspaceMembers) return null;
    
    // Check if user is the workspace owner
    if (activeWorkspace.ownerId === currentUser.id) {
      return 'owner';
    }
    
    // Check if user is a member and get their role
    const memberInfo = workspaceMembers.find(member => member.userId === currentUser.id);
    return memberInfo?.role || null;
  }, [currentUser, activeWorkspace, workspaceMembers]);

  const userPermissions = useMemo(() => {
    const role = currentUserRole;
    
    return {
      canEdit: role === 'owner' || role === 'editor',
      canView: role === 'owner' || role === 'editor' || role === 'viewer',
      canDelete: role === 'owner' || role === 'editor',
      canCreatePages: role === 'owner' || role === 'editor',
      canManageMembers: role === 'owner',
      canDeleteWorkspace: role === 'owner',
      isOwner: role === 'owner',
      isEditor: role === 'editor',
      isViewer: role === 'viewer'
    };
  }, [currentUserRole]);

  const checkPermission = useCallback((action) => {
    return userPermissions[action] || false;
  }, [userPermissions]);

  const requirePermission = useCallback((action, errorMessage) => {
    if (!checkPermission(action)) {
      toast.error(errorMessage || `You don't have permission to ${action}`);
      return false;
    }
    return true;
  }, [checkPermission]);

  const logout = useCallback(async () => {
    try {
      await logoutUserApi();
    } catch (error) {
      console.error(
        'API logout failed, proceeding with client-side cleanup.',
        error
      );
    } finally {
      setWorkspaces({ owned: [], shared: [] });
      setActiveWorkspace(null);
      setWorkspaceMembers([]);
      setCurrentUser(null);
      setPendingInvitations([]);
      clearCookie('accessToken');
      clearCookie('refreshToken');
      localStorage.removeItem('lastActiveWorkspaceId');
      navigate('/login');
    }
  }, [navigate]);

  const fetchWorkspaces = useCallback(async () => {
    try {
      const response = await getAllWorkspacesApi();
      setWorkspaces(response);
      const lastActiveId = localStorage.getItem('lastActiveWorkspaceId');
      if (lastActiveId) {
        const allWorkspaces = [...response.owned, ...response.shared];
        const lastActive = allWorkspaces.find(
          (ws) => ws.id === parseInt(lastActiveId)
        );
        setActiveWorkspace(lastActive || response.owned[0] || null);
      } else {
        setActiveWorkspace(response.owned[0] || null);
      }
      return response; // Return the fetched data
    } catch (err) {
      console.error('Error fetching workspaces:', err);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const user = await getCurrentUserApi();
      setCurrentUser(user);
      return user;
    } catch (err) {
      console.error('Error fetching current user:', err);
      setCurrentUser(null);
      return null;
    }
  }, []);

  const fetchPendingInvitations = useCallback(async () => {
    try {
      const invitations = await getPendingInvitationsApi();
      setPendingInvitations(invitations);
    } catch (error) {
      console.error('Failed to fetch pending invitations', error);
    }
  }, []);

  const initializeSession = useCallback(async () => {
    setLoading(true);
    const user = await fetchCurrentUser();
    if (user) {
      await Promise.all([fetchWorkspaces(), fetchPendingInvitations()]);
    }
    setLoading(false);
  }, [fetchCurrentUser, fetchWorkspaces, fetchPendingInvitations]);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const refetchWorkspaceMembers = useCallback(async () => {
    if (!activeWorkspace) return;
    try {
      const response = await getAllWorkspaceMembersApi(activeWorkspace.id);
      setWorkspaceMembers(response.members);
    } catch (err) {
      console.error('Error refetching workspace members:', err);
    }
  }, [activeWorkspace]);

  useEffect(() => {
    if (activeWorkspace) {
      localStorage.setItem('lastActiveWorkspaceId', activeWorkspace.id);
      refetchWorkspaceMembers();
    } else {
      setWorkspaceMembers([]);
    }
  }, [activeWorkspace, refetchWorkspaceMembers]);


  const handleInvitationAction = async (token, action) => {
    try {
      if (action === 'accept') {
        await acceptInvitationApi(token);
        toast.success('Invitation accepted!');
      } else {
        await declineInvitationApi(token);
        toast.success('Invitation declined.');
      }
      await Promise.all([fetchWorkspaces(), fetchPendingInvitations()]);
    } catch (error) {
      toast.error(`Failed to ${action} invitation.`);
      console.error(`Error handling invitation:`, error);
    }
  };


  const deleteWorkspace = async (workspaceId) => {
    if (!requirePermission('canDeleteWorkspace', 'Only workspace owners can delete workspaces')) {
      return;
    }

    try {
      await deleteWorkspaceApi(workspaceId);
      toast.success('Workspace deleted successfully!');
      await fetchWorkspaces(); // Refetch after deleting
    } catch (error) {
      toast.error('Failed to delete workspace.');
      console.error('Error deleting workspace:', error);
    }
  };

  const addWorkspace = async (name) => {
    try {
      const newWorkspace = await createWorkspaceApi(name);

      const updatedWorkspaces = await fetchWorkspaces();

      if (updatedWorkspaces) {
        const newlyCreated = updatedWorkspaces.owned.find(
          (ws) => ws.id === newWorkspace.id
        );
        if (newlyCreated) {
          setActiveWorkspace(newlyCreated);
        }
      }
      return newWorkspace;
    } catch (error) {
      console.error('Error creating workspace:', error);
      throw error;
    }
  };

  const removeWorkspaceMember = async (workspaceId, memberIdToRemove) => {
    if (!requirePermission('canManageMembers', 'Only workspace owners can manage members')) {
      return;
    }

    try {
      await removeAMemberApi(workspaceId, memberIdToRemove);
      if (memberIdToRemove === currentUser?.id) {
        toast.success('You have left the workspace.');
        await fetchWorkspaces();
      } else {
        toast.success('Member removed successfully!');
        await refetchWorkspaceMembers();
      }
    } catch (error) {
      toast.error('Failed to remove member.');
      console.error('Error removing member:', error);
    }
  };

  const value = {
    currentUser,
    fetchCurrentUser,
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    addWorkspace,
    loading,
    workspaceMembers,
    pendingInvitations,
    removeWorkspaceMember,
    logout,
    initializeSession,
    refetchWorkspaceMembers,
    deleteWorkspace,
    handleInvitationAction,
    // Role-based access control
    currentUserRole,
    userPermissions,
    checkPermission,
    requirePermission,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};


export const useWorkspaces = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspaces must be used within a WorkspaceProvider');
  }
  return context;
};

