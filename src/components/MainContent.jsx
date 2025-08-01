import React from 'react';

const MainContent = ({ recentPages, theme, workspaceTitle }) => {
  return (
    <div className="flex-1 p-6">
      {/* Display the workspace title */}
      <h1 className="text-3xl font-semibold text-gray-900">Workspace: {workspaceTitle}</h1>
      
      {/* You can display the workspace content here */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Recent Pages</h2>
        <ul className="mt-2">
          {recentPages.map((page, index) => (
            <li key={index} className="text-gray-700">{page.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MainContent;
