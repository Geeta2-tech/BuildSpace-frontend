// components/PageEditor/EditorToolbar.js
import React from 'react';
import { Eye, Lock, Edit3 } from 'lucide-react';

const EditorToolbar = ({
  onCancel,
  isEditMode,
  createdPageData,
  currentUserRole,
  isReadOnly,
  isEditorReady,
  isConnected,
  content
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>
        
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-sm">
            {(isEditMode || createdPageData) ? '' : 'New page'}
          </span>

          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
            currentUserRole === 'owner' 
              ? 'bg-blue-500/20 text-blue-400' 
              : currentUserRole === 'editor'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gray-500/20 text-gray-400'
          }`}>
            {isReadOnly ? (
              <>
                <Eye className="w-3 h-3" />
                <span>READ ONLY</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3 h-3" />
                <span>EDIT MODE</span>  
              </>
            )}
          </div>
        </div>

        

        
      </div>

      <div className="flex items-center space-x-3">
        

        <div className="text-xs text-gray-500">
          <span className="ml-3">
            Content: {content ? 'Loaded' : 'Empty'}
          </span>
          {!isEditMode && (
            <span className="ml-3">
              Status: {createdPageData ? 'Page Created' : 'New Draft'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;