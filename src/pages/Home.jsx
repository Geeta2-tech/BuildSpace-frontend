import React from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import { useTheme } from '../hooks/useTheme';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { usePages } from '../hooks/usePages';

const Home = () => {
  const { theme, toggleTheme } = useTheme();
  const { workspaces, activeWorkspace, setActiveWorkspace } = useWorkspaces();
  const { recentPages } = usePages();

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar 
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <MainContent 
        recentPages={recentPages}
        theme={theme}
      />
    </div>
  );
};

export default Home;