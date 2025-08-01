import React, { createContext, useContext, useState } from 'react';

// Create the context
const WorkspaceContext = createContext();

// Create the provider component
export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  
  // Helper function to add a new workspace and set it as active
  const addWorkspace = (newWorkspace) => {
    setWorkspaces(prev => [...prev, newWorkspace]);
    setActiveWorkspace(newWorkspace);
  };
  
  const value = {
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    setWorkspaces,
    addWorkspace
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