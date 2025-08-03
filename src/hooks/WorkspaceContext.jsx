import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllWorkspaceMembers,
  getAllWorkspaces,
  deleteWorkspace as deleteWorkspaceApi,
} from '../apis/workspaceApi';
import { logoutUser as apiLogoutUser } from '../apis/authApi';
import toast from 'react-hot-toast';

const clearCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState({
    owned: [],
    shared: [],
  });
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const navigate = useNavigate();

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
      clearCookie('accessToken');
      clearCookie('refreshToken');
      localStorage.removeItem('lastActiveWorkspaceId');
      navigate('/login');
    }
  }, [navigate]);

  const fetchWorkspaces = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllWorkspaces();
      setWorkspaces(response);

      const lastActiveId = localStorage.getItem('lastActiveWorkspaceId');
      if (lastActiveId) {
        const allWorkspaces = [...response.owned, ...response.shared];
        const lastActive = allWorkspaces.find((ws) => ws.id === lastActiveId);
        setActiveWorkspace(lastActive || response.owned[0] || null);
      } else {
        setActiveWorkspace(response.owned[0] || null);
      }
    } catch (err) {
      console.error('Error fetching workspaces:', err);
      if (err.response && err.response.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

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
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (activeWorkspace) {
      localStorage.setItem('lastActiveWorkspaceId', activeWorkspace.id);
      refetchWorkspaceMembers();
    } else {
      setWorkspaceMembers([]);
    }
  }, [activeWorkspace, refetchWorkspaceMembers]);

  // **NEW**: Function to handle workspace deletion
  const deleteWorkspace = async (workspaceId) => {
    try {
      await deleteWorkspaceApi(workspaceId);

      // Update local state after successful deletion
      const newWorkspaces = {
        ...workspaces,
        owned: workspaces.owned.filter((ws) => ws.id !== workspaceId),
      };
      setWorkspaces(newWorkspaces);

      // If the deleted workspace was the active one, find a new active workspace
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
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    addWorkspace,
    loading,
    workspaceMembers,
    removeWorkspaceMember,
    logout,
    refetchWorkspaces: fetchWorkspaces,
    refetchWorkspaceMembers,
    deleteWorkspace, // Expose the delete function
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
