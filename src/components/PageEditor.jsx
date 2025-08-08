// components/PageEditor/index.js
import { useState, useRef, useEffect } from 'react';
import { getPageById } from '../apis/pageApi';
import { useWorkspaces } from '../hooks/WorkspaceContext';
import toast from 'react-hot-toast';
import EditorToolbar from './Editor';
import ReadOnlyBanner from './ReadOnlyBanner';
import PageTitleInput from './PageTitleInput';
import TextEditor from './TextEditor';
import EditorStyles from './EditorStyles';
import useWebSocket from '../hooks/useWebSocket';
import useEditorPermissions from '../hooks/useEditorPermissions';

const PageEditor = ({
  onPageCreated,
  onCancel,
  workspaceId,
  selectedPage = null,
  onPageUpdated,
}) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [createdPageData, setCreatedPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBlockId, setCurrentBlockId] = useState(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const editorInstance = useRef(null);

  const { userPermissions, currentUserRole, currentUser } = useWorkspaces();
  const isEditMode = selectedPage !== null || createdPageData !== null;
  const currentPage = selectedPage || createdPageData;
  const isReadOnly = !userPermissions.canEdit;

  // Custom hooks for cleaner logic
  useEditorPermissions({
    isEditMode,
    userPermissions,
    onCancel
  });

  const { ws, isConnected, createNewPage } = useWebSocket({
    isEditMode,
    createdPageData,
    workspaceId,
    currentPage,
    currentUser,
    userPermissions,
    currentBlockId,
    isReadOnly,
    content,
    setContent,
    setTitle,
    setCreatedPageData,
    setIsLoading,
    setCurrentBlockId,
    titleRef,
    isEditorReady,
    editorInstance
  });

  // Load page content
  useEffect(() => {
    const loadPageContent = async () => {
      if (isEditMode && currentPage) {
        setIsLoading(true);
        try {
          const pageData = await getPageById(currentPage.id);
          setTitle(pageData.title || '');
          setContent(pageData.content || '');
        } catch (error) {
          console.error('Error loading page:', error);
          toast.error('Failed to load page content.');
        } finally {
          setIsLoading(false);
        }
      } else if (!isEditMode && createdPageData) {
        setIsLoading(false);
        if (titleRef.current && !isReadOnly) {
          titleRef.current.focus();
          titleRef.current.select();
        }
      } else {
        setIsLoading(false);
      }
    };

    loadPageContent();

  }, [currentPage?.id, isEditMode, createdPageData, isReadOnly]);


  // Keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  const handleCancel = () => {
    if (createdPageData && onPageCreated) {
      onPageCreated(createdPageData);
    }
    onCancel && onCancel();
  };

  const handleTitleChange = (e) => {
    if (isReadOnly) {
      toast.error('You don\'t have permission to edit this page');
      return;
    }

    const newTitle = e.target.value;
    setTitle(newTitle);

    if (ws && ws.readyState === WebSocket.OPEN) {
      const pageId = isEditMode ? currentPage.id : (createdPageData ? createdPageData.id : null);
      
      if (pageId) {
        ws.send(
          JSON.stringify({
            type: 'title_update',
            title: newTitle || 'Untitled',
            pageId: pageId,
            blockId: currentBlockId,
          })
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 bg-[#191919] min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading page...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-[#191919] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <EditorToolbar
          onCancel={handleCancel}
          isEditMode={isEditMode}
          createdPageData={createdPageData}
          currentUserRole={currentUserRole}
          isReadOnly={isReadOnly}
          isEditorReady={isEditorReady}
          isConnected={isConnected}
          content={content}
        />

        <ReadOnlyBanner 
          isReadOnly={isReadOnly} 
          currentUserRole={currentUserRole} 
        />

        <div className="bg-[#191919]">
          <PageTitleInput
            titleRef={titleRef}
            title={title}
            onTitleChange={handleTitleChange}
            isReadOnly={isReadOnly}
            isLoading={isLoading}
            createdPageData={createdPageData}
            isEditMode={isEditMode}
          />

          <TextEditor
            contentRef={contentRef}
            content={content}
            setContent={setContent}
            isLoading={isLoading}
            isReadOnly={isReadOnly}
            currentPage={currentPage}
            isEditMode={isEditMode}
            ws={ws}
            currentBlockId={currentBlockId}
            isEditorReady={isEditorReady}
            setIsEditorReady={setIsEditorReady}
            editorInstance={editorInstance}
          />
        </div>

        <EditorStyles content={content} />
      </div>
    </div>
  );
};

export default PageEditor;