// src/hooks/useWorkspaces.jsx
import { useContext } from 'react';
import { WorkspaceContext } from './WorkspaceContext'; // Import the context

export const useWorkspaces = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspaces must be used within a WorkspaceProvider');
  }
  return context;
};
