import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Lock } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import PageEditor from '../components/PageEditor'; 
import { useTheme } from '../hooks/useTheme';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { usePages } from '../hooks/usePages';
import toast from 'react-hot-toast';

const Home = () => {
  const { theme = 'light', toggleTheme } = useTheme();

  const { workspaces, activeWorkspace, setActiveWorkspace, workspaceMembers } =
    useWorkspaces();
  
  // Get pages data and utility functions
  const { 
    recentPages, 
    loading, 
    error, 
    refetchPages, 
    removePageFromState,
    addPageToState,
    updatePageInState 
  } = usePages(activeWorkspace?.id);

  const [selectedPage, setSelectedPage] = useState(null);

  const handlePageSelect = (page) => {
    setSelectedPage(page);
  };

  const handleCloseEditor = () => {
    setSelectedPage(null);
  };

  const handlePageUpdated = (updatedPage) => {
    // Update the page in local state immediately
    if (updatedPage && updatedPage.id) {
      updatePageInState(updatedPage.id, updatedPage);
    }
    setSelectedPage(null);
  };

  const handlePageCreated = (newPage) => {
    // If newPage is just a title string, you might need to create a page object
    // Adjust this based on what your PageEditor component returns
    if (typeof newPage === 'string') {
      // Add the new page to local state (you might want to refetch instead for complete data)
      refetchPages();
    } else {
      // If it's a complete page object, add it immediately
      addPageToState(newPage);
    }
  };

  const handlePageDeleted = (deletedPageId) => {
    // Immediately remove the page from local state for instant UI update
    removePageFromState(deletedPageId);
    
    // If the deleted page is currently selected, close the editor
    if (selectedPage && selectedPage.id === deletedPageId) {
      setSelectedPage(null);
    }
  };

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
        pages={recentPages}
        pagesLoading={loading}
        pagesError={error}
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
          onPageSelect={handlePageSelect}
          onPageCreated={handlePageCreated}
          onPageDeleted={handlePageDeleted} // Pass the delete handler
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