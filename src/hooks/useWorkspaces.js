import { useState } from 'react';
import { MOCK_WORKSPACES } from '../utils/mockData';

export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState(MOCK_WORKSPACES);
  const [activeWorkspace, setActiveWorkspace] = useState(MOCK_WORKSPACES[0]);
  
  return { workspaces, activeWorkspace, setActiveWorkspace, setWorkspaces };
};