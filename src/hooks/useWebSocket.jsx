import { useState, useEffect } from 'react';

const useWebSocket = ({
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
}) => {
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const createNewPage = async () => {
    if (!isEditMode && !createdPageData && workspaceId && userPermissions.canCreatePages) {
      setIsLoading(true);
      
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'create_page',
            title: 'Untitled',
            workspaceId: workspaceId,
            pageId: `new-${Date.now()}`,
            createdBy: currentUser?.id || null,
            parentPageId: null,
          })
        );
      }
    }
  };

  // Create page immediately when component mounts for new pages
  useEffect(() => {
    if (isConnected && !isEditMode && !createdPageData && userPermissions.canCreatePages) {
      createNewPage();
    }
  }, [isConnected, isEditMode, createdPageData, workspaceId, ws, currentUser, userPermissions]);

  // WebSocket connection effect
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3333');
    setWs(socket);

    socket.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);

      const pageId = isEditMode ? currentPage.id : `new-${Date.now()}`;
      socket.send(
        JSON.stringify({
          type: 'join',
          pageId: pageId,
          blockId: currentBlockId,
          isNewPage: !isEditMode,
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'initial_data':
            if (isEditMode && data.data) {
              if (data.data !== content) {
                setContent(data.data);
              }
              if (data.blockId) {
                setCurrentBlockId(data.blockId);
              }
            }
            break;

          case 'text_update':
            if (isReadOnly) break;
            
            const newContent = data.content;
            if (newContent !== content) {
              setContent(newContent);

              if (editorInstance.current && isEditorReady && newContent) {
                try {
                  const parsed = JSON.parse(newContent);
                  if (parsed.blocks) {
                    editorInstance.current.render(parsed);
                  }
                } catch (e) {
                  console.error('Error rendering new content:', e);
                }
              }
            }

            if (data.blockId && !currentBlockId) {
              setCurrentBlockId(data.blockId);
            }
            break;

          case 'title_update':
            if (!isReadOnly) {
              setTitle(data.title);
            }
            break;

          case 'page_created':
            if (data.originalPageId && data.page) {
              setCreatedPageData(data.page);
              setTitle(data.page.title || 'Untitled');
              setIsLoading(false);
              
              setTimeout(() => {
                if (titleRef.current && !isReadOnly) {
                  titleRef.current.focus();
                  titleRef.current.select();
                }
              }, 1000);
              
              console.log('Page auto-created via WebSocket:', data.page);
            }
            break;

          case 'page_created_broadcast':
            console.log('Another user created a page:', data.page);
            break;

          default:
            if (typeof event.data === 'string' && !isReadOnly) {
              setContent(event.data);
            }
        }
      } catch (error) {
        if (typeof event.data === 'string' && !isReadOnly) {
          setContent(event.data);
        }
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [currentPage?.id, isEditMode, isReadOnly]);

  return { ws, isConnected, createNewPage };
};
export default useWebSocket;