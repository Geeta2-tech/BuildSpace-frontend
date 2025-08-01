import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllWorkspaces } from '../apis/workspaceApi';

// Create the context
const WorkspaceContext = createContext();

// Create the provider component
export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState({
    owned: [],
    shared: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await getAllWorkspaces();
        console.log(response);
        setWorkspaces(response);
        setActiveWorkspace(response.owned[0]);
      } catch (err) {
        console.error('Error fetching workspaces:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  // Helper function to add a new workspace and set it as active
  const addWorkspace = (newWorkspace) => {
    setWorkspaces((prev) => ({
      ...prev,
      owned: [...prev.owned, newWorkspace],
    }));
    setActiveWorkspace(newWorkspace);
  };

  const value = {
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    setWorkspaces,
    addWorkspace,
    loading,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

// Custom hook to use the workspace context
export const useWorkspaces = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspaces must be used within a WorkspaceProvider');
  }
  return context;
};
