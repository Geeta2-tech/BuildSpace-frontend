
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import PageEditor from '../components/PageEditor'; // Import PageEditor
import { useTheme } from '../hooks/useTheme';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { usePages } from '../hooks/usePages';

const Home = () => {
  const { theme = 'light', toggleTheme } = useTheme();

  const { workspaces, activeWorkspace, setActiveWorkspace } = useWorkspaces();
  // Pass the activeWorkspace.id to usePages hook
  const { recentPages, loading, error } = usePages(activeWorkspace?.id);
  
  // Add state for selected page
  const [selectedPage, setSelectedPage] = useState(null);

  // Handle page selection from sidebar
  const handlePageSelect = (page) => {
    setSelectedPage(page);
  };

  // Handle closing page editor
  const handleCloseEditor = () => {
    setSelectedPage(null);
  };

  // Handle page updated
  const handlePageUpdated = (updatedPage) => {
    // You might want to refresh the pages list here
    // or update the specific page in the list
    setSelectedPage(null);
  };

  const { workspaces, activeWorkspace, setActiveWorkspace, workspaceMembers } =
    useWorkspaces();
  const { recentPages } = usePages();


  return (
    <div
      className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
    >
      <Sidebar
        workspaces={workspaces}
        workspaceMembers={workspaceMembers}
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        theme={'dark'}
        toggleTheme={toggleTheme}
        // Pass pages data to sidebar
        pages={recentPages}
        pagesLoading={loading}
        pagesError={error}
        // Add page selection handler
        onPageSelect={handlePageSelect}
      />
      
      {/* Conditionally render PageEditor or MainContent */}
      {selectedPage ? (
        <PageEditor
          selectedPage={selectedPage}
          workspaceId={activeWorkspace?.id}
          onCancel={handleCloseEditor}
          onPageUpdated={handlePageUpdated}
        />
      ) : activeWorkspace ? (
        <MainContent
          recentPages={recentPages}
          workspaceTitle={activeWorkspace.name}
          workspaceId={activeWorkspace.id}
        />
      ) : (
        <div className="flex items-center justify-center w-full text-center text-gray-500 mt-20">
          <div>
            <h2 className="text-2xl font-semibold">Welcome to Notion</h2>
            <p className="mt-2">Switch or create your workspace</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;