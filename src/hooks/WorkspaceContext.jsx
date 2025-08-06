import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllWorkspaceMembers,
  getAllWorkspaces,
  deleteWorkspaceApi,
  getPendingInvitationsApi,
  acceptInvitationApi,
  declineInvitationApi,
} from '../apis/workspaceApi';
import {
  logoutUser as apiLogoutUser,
  getCurrentUserApi,
} from '../apis/authApi';
import toast from 'react-hot-toast';

// Clear cookies for logout
const clearCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Create and export the context
export const WorkspaceContext = createContext();

// Export the provider
export const WorkspaceProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined); // Authenticated user details
  const [workspaces, setWorkspaces] = useState({ // All the user workspaces (Owned and shared)
    owned: [],
    shared: [],
  });
  const [workspaceMembers, setWorkspaceMembers] = useState([]); // Members of the active workspace
  const [pendingInvitations, setPendingInvitations] = useState([]); // Pending invitations of the user
  const [loading, setLoading] = useState(true); // Loading state
  const [activeWorkspace, setActiveWorkspace] = useState(null); // Active workspace (User is currently working on)
  const navigate = useNavigate(); // Navigate to different pages

  const logout = useCallback(async () => {
    try {
      await apiLogoutUser();
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
      const response = await getAllWorkspaces();
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

  // **NEW**: Function to fetch pending invitations
  const fetchPendingInvitations = useCallback(async () => {
    try {
      const invitations = await getPendingInvitationsApi();
      setPendingInvitations(invitations);
    } catch (error) {
      console.error('Failed to fetch pending invitations', error);
    }
  }, []);

  useEffect(() => {
    const initializeUserSession = async () => {
      setLoading(true);
      const user = await fetchCurrentUser();
      if (user) {
        // Fetch workspaces and invitations in parallel for efficiency
        await Promise.all([fetchWorkspaces(), fetchPendingInvitations()]);
      }
      setLoading(false);
    };
    initializeUserSession();
  }, [fetchCurrentUser, fetchWorkspaces, fetchPendingInvitations]);

  const refetchWorkspaceMembers = useCallback(async () => {
    if (!activeWorkspace) return;
    try {
      const response = await getAllWorkspaceMembers(activeWorkspace.id);
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

  // **NEW**: Function to handle both accept and decline actions
  const handleInvitationAction = async (token, action) => {
    try {
      if (action === 'accept') {
        await acceptInvitationApi(token);
        toast.success('Invitation accepted!');
      } else {
        await declineInvitationApi(token);
        toast.success('Invitation declined.');
      }
      // After action, refetch everything to update the UI
      await Promise.all([fetchWorkspaces(), fetchPendingInvitations()]);
    } catch (error) {
      toast.error(`Failed to ${action} invitation.`);
      console.error(`Error handling invitation:`, error);
    }
  };

  const deleteWorkspace = async (workspaceId) => {
    try {
      await deleteWorkspaceApi(workspaceId);
      const newWorkspaces = {
        ...workspaces,
        owned: workspaces.owned.filter((ws) => ws.id !== workspaceId),
      };
      setWorkspaces(newWorkspaces);
      if (activeWorkspace?.id === workspaceId) {
        const nextActive =
          newWorkspaces.owned[0] || newWorkspaces.shared[0] || null;
        setActiveWorkspace(nextActive);
      }
      toast.success('Workspace deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete workspace.');
      console.error('Error deleting workspace:', error);
    }
  };

  const addWorkspace = (newWorkspace) => {
    setWorkspaces((prev) => ({
      ...prev,
      owned: [...prev.owned, newWorkspace],
    }));
    setActiveWorkspace(newWorkspace);
  };

  const removeWorkspaceMember = (memberIdToRemove) => {
    setWorkspaceMembers((currentMembers) =>
      currentMembers.filter((member) => member.userId !== memberIdToRemove)
    );
  };

  const value = {
    currentUser,
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    addWorkspace,
    loading,
    workspaceMembers,
    pendingInvitations, // Expose invitations
    removeWorkspaceMember,
    logout,
    refetchWorkspaces: fetchWorkspaces,
    refetchWorkspaceMembers,
    deleteWorkspace,
    handleInvitationAction, // Expose the handler
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
