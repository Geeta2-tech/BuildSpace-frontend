import { useState } from 'react';
import { Plus } from 'lucide-react';
import NewPageEditor from './PageEditor'; // Import the new editor component

const MainContent = ({ recentPages, workspaceTitle, workspaceId }) => {
  const [showNewPageEditor, setShowNewPageEditor] = useState(false);
  const handleNewPageClick = () => {
    setShowNewPageEditor(true);
  };

  const handlePageCreated = (title) => {
    setShowNewPageEditor(false);
    // You can add logic here to refresh the page list or navigate to the new page
    console.log('Page created with title:', title);
  };

  const handleCancelNewPage = () => {
    setShowNewPageEditor(false);
  };

  // If showing new page editor, render it instead of the main content
  if (showNewPageEditor) {
    return (
      <NewPageEditor
        onPageCreated={handlePageCreated}
        onCancel={handleCancelNewPage}
        workspaceId={workspaceId} // Pass the workspace ID to the editor
      />
    );
  }

  return (
    <div className="flex-1 p-6 bg-[#191919]">
      {/* Display the workspace title */}
      <h1 className="text-3xl font-semibold text-white">{workspaceTitle}</h1>

      {/* Recent Pages Section */}
      <div className="mt-6">
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* New Page Creation Card */}
          <div
            onClick={handleNewPageClick}
            className="relative p-4 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <Plus className="text-white w-6 h-6" />
            <span className="text-white ml-2">New Page</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
