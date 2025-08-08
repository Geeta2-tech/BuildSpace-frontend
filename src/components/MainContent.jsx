// Updated MainContent.jsx
import { useState } from 'react';
import { Plus, FileText, Trash2 } from 'lucide-react';
import NewPageEditor from './PageEditor';
import { deletePage } from '../apis/pageApi';
import toast from 'react-hot-toast';

const MainContent = ({ 
  recentPages, 
  workspaceTitle, 
  workspaceId, 
  onPageSelect, 
  onPageCreated, 
  onPageDeleted // Add this new prop
}) => {
  const [showNewPageEditor, setShowNewPageEditor] = useState(false);
  
  const handleNewPageClick = () => {
    setShowNewPageEditor(true);
  };

  const handlePageCreated = (title) => {
    setShowNewPageEditor(false);
    console.log('Page created with title:', title);
    onPageCreated && onPageCreated(title);
  };

  const handleCancelNewPage = () => {
    setShowNewPageEditor(false);
  };

  const handleDeletePage = async (pageId) => {
    try {
      // First, remove from local state for immediate UI feedback
      onPageDeleted && onPageDeleted(pageId);
      
      // Then perform the API call
      await deletePage(pageId);
      toast.success('Page deleted successfully!');
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Error deleting page');
      
      // If deletion failed, you might want to revert the optimistic update
      // by refetching the pages or re-adding the page to state
      // For now, we'll just refetch to ensure consistency
      onPageDeleted && refetchPages && refetchPages();
    }
  };

  // If showing new page editor, render it instead of the main content
  if (showNewPageEditor) {
    return (
      <NewPageEditor
        onPageCreated={handlePageCreated}
        onCancel={handleCancelNewPage}
        workspaceId={workspaceId}
      />
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#191919] to-[#1a1a1a]">
      {/* Header Section */}
      <div className="px-8 pt-12 pb-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text">
            {workspaceTitle}
          </h1>
          <p className="text-gray-400 mt-4 text-lg">Build and manage your own space with BuildSpace</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="mb-12 mt-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold text-gray-200">Pages</h2>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </div>

          {/* Pages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 max-h-110 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {/* New Page Creation Card */}
            <div
              onClick={handleNewPageClick}
              className="group relative overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30"
            >
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-32 text-center">
                <div className="mb-3 p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 group-hover:border-blue-400/50 transition-colors duration-300">
                  <Plus className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                </div>
                <span className="text-gray-200 font-medium group-hover:text-white transition-colors duration-300">
                  Create New Page
                </span>
                <span className="text-gray-500 text-sm mt-1 group-hover:text-gray-400 transition-colors duration-300">
                  Start writing
                </span>
              </div>

              {/* Subtle border glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>

            {/* Recent Pages */}
            {recentPages && recentPages.length > 0 && recentPages.map((page, index) => (
              <div
                key={page.id || index}
                className="group relative overflow-hidden bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-gray-600/50"
                onClick={() => onPageSelect && onPageSelect(page)}
              >
                <button
                  onClick={(e) => {
                    console.log('Delete button clicked for page:', page.id);
                    e.stopPropagation();
                    handleDeletePage(page.id);
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors z-20"
                  aria-label="Delete page"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="relative z-10 flex flex-col h-32">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 font-medium text-sm truncate">
                      {page.title || 'Untitled'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs line-clamp-3 flex-1">
                    {page.preview || 'No preview available'}
                  </p>
                  <div className="text-gray-600 text-xs mt-2">
                    {page.lastModified || 'Recently'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State Message */}
          {(!recentPages || recentPages.length === 0) && (
            <div className="text-center py-12 mt-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full border border-gray-700/50 mb-4">
                <FileText className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-gray-300 font-medium mb-2">No pages yet</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Get started by creating your first page. Click the "Create New Page" card above to begin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;