import { useState, useRef, useEffect } from 'react';
import { createPage, updatePage, getPageById } from '../apis/pageApi';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Code from '@editorjs/code';
import Quote from '@editorjs/quote';

const PageEditor = ({
  onPageCreated,
  onCancel,
  workspaceId,
  selectedPage = null,
  onPageUpdated,
}) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [createdPageData, setCreatedPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentBlockId, setCurrentBlockId] = useState(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const editorInstance = useRef(null);

  const isEditMode = selectedPage !== null || createdPageData !== null;
  const currentPage = selectedPage || createdPageData;

  // Load page content first
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
          alert('Failed to load page content.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        if (titleRef.current) {
          titleRef.current.focus();
        }
      }
    };

    loadPageContent();
  }, [currentPage?.id]);

  // Initialize Editor.js AFTER content is loaded
  useEffect(() => {
    if (!contentRef.current || isLoading) return;

    if (
      editorInstance.current &&
      typeof editorInstance.current.destroy === 'function'
    ) {
      editorInstance.current.destroy();
      setIsEditorReady(false);
    }

    // Convert content to Editor.js format
    let editorData = { blocks: [] };
    if (content) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.blocks && Array.isArray(parsed.blocks)) {
          editorData = parsed;
        } else {
          throw new Error('Not Editor.js format');
        }
      } catch (e) {
        const lines = content.split('\n').filter((line) => line.trim() !== '');
        if (lines.length > 0) {
          editorData = {
            blocks: lines.map((line) => ({
              type: 'paragraph',
              data: { text: line.trim() },
            })),
          };
        }
      }
    }

    editorInstance.current = new EditorJS({
      holder: contentRef.current,
      // Only show placeholder if there's no content
      placeholder:
        editorData.blocks && editorData.blocks.length > 0
          ? ''
          : 'Start writing...',
      tools: {
        header: Header,
        list: List,
        code: Code,
        quote: Quote,
      },
      data: editorData,
      onChange: async () => {
        if (editorInstance.current && ws && ws.readyState === WebSocket.OPEN) {
          try {
            const outputData = await editorInstance.current.save();
            const jsonString = JSON.stringify(outputData);

            const pageId = isEditMode ? currentPage.id : `new-${Date.now()}`;
            ws.send(
              JSON.stringify({
                type: 'text_update',
                content: jsonString,
                pageId: pageId,
                blockId: currentBlockId,
              })
            );
          } catch (error) {
            console.error('Error getting editor data for WS:', error);
          }
        }
      },
      onReady: () => {
        setIsEditorReady(true);
        // Hide the placeholder if we have content
        if (editorData.blocks && editorData.blocks.length > 0) {
          const placeholder = document.querySelector('.codex-editor--empty');
          if (placeholder) {
            placeholder.style.display = 'none';
          }
        }
      },
    });

    return () => {
      if (
        editorInstance.current &&
        typeof editorInstance.current.destroy === 'function'
      ) {
        editorInstance.current.destroy();
      }
    };
  }, [isLoading, content, currentPage?.id]);

  // Manual save handler
  const handleManualSave = async () => {
    if (!isEditMode || !currentPage || !isEditorReady) return;
    setSaveStatus('Saving...');
    try {
      const outputData = await editorInstance.current.save();
      const contentJson = JSON.stringify(outputData);

      await updatePage(currentPage.id, {
        title: title.trim(),
        content: contentJson,
      });

      setContent(contentJson);
      const updatedPage = {
        ...currentPage,
        title: title.trim(),
        content: contentJson,
      };
      if (createdPageData) {
        setCreatedPageData(updatedPage);
      }
      onPageUpdated && onPageUpdated(updatedPage);

      setSaveStatus('Saved!');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Error manually saving page:', error);
      setSaveStatus('Save failed!');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleManualSave();
      }
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [currentPage, isEditMode, title, createdPageData, isEditorReady]);

  const handleCancel = () => {
    if (createdPageData && onPageCreated) {
      onPageCreated(createdPageData.title);
    }
    onCancel && onCancel();
  };

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
            setTitle(data.title);
            break;

          default:
            if (typeof event.data === 'string') {
              setContent(event.data);
            }
        }
      } catch (error) {
        if (typeof event.data === 'string') {
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
  }, [currentPage?.id, isEditMode]);

  const handleTitleChange = async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (!isEditMode && newTitle.trim() && !createdPageData) {
      setSaveStatus('Creating page...');
      try {
        const createdPage = await createPage(newTitle.trim(), workspaceId);
        setCreatedPageData(createdPage);
        setSaveStatus('Page created!');
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (error) {
        console.error('Error auto-saving page:', error);
        setSaveStatus('Failed to create page.');
      }
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
      const pageId = isEditMode ? currentPage.id : `new-${Date.now()}`;
      ws.send(
        JSON.stringify({
          type: 'title_update',
          title: newTitle,
          pageId: pageId,
          blockId: currentBlockId,
        })
      );
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
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <span className="text-gray-500 text-sm">
              {isEditMode ? 'Editing page' : 'New page'}
            </span>

            <span
              className={`text-sm ${isEditorReady ? 'text-blue-400' : 'text-gray-500'}`}
            >
              {isEditorReady ? '' : '⏳ Loading Editor'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-400 text-sm">
              {saveStatus ||
                (isEditMode
                  ? 'Press Ctrl+S to save'
                  : 'Type title to create page')}
            </span>
            <div className="text-xs text-gray-500">
              <span className="ml-3">
                Content: {content ? 'Loaded' : 'Empty'}
              </span>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-[#191919]">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full bg-transparent text-white text-4xl font-bold placeholder-gray-500 border-none outline-none mb-4"
            style={{
              fontSize: '3rem',
              lineHeight: '1.2',
              minHeight: '4rem',
            }}
          />

          <div className="mt-4">
            <div
              ref={contentRef}
              style={{
                minHeight: '400px',
                lineHeight: '1.6',
              }}
              className="text-white"
            />
          </div>
        </div>

        {/* Dark theme styles for Editor.js */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
    /* Hide empty state when content exists */
    .codex-editor--empty {
      display: ${content ? 'none' : 'block'} !important;
      opacity: 0.7 !important; /* More subtle placeholder */
    }
    
    /* Base editor styles */
    .codex-editor {
      color: #ffffff !important;
      --active-bg: #3b82f6 !important;
      --active-text: #ffffff !important;
    }
    
    /* Content blocks */
    .ce-block__content, 
    .ce-paragraph, 
    .ce-header {
      color: #ffffff !important;
    }
    .ce-paragraph { 
      font-size: 1.1rem; 
      line-height: 1.6; 
    }
    
    /* Code block - high contrast */
    .ce-code__textarea {
      background-color: #f0f2f5 !important;
      color: #1a1a1a !important;
      border: 1px solid #d0d5dd !important;
      border-radius: 4px !important;
    }
    
    /* ===== TOOLBAR BUTTONS ===== */
    /* Main toolbar container */
    .ce-toolbar {
      background: #2d3748 !important;
      border-radius: 6px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
    }
    
    /* All buttons */
    .ce-toolbar__button {
      color: #e2e8f0 !important;
      transition: all 0.15s ease !important;
    }
    
    /* Plus button - standout */
    .ce-toolbar__plus {
      color: white !important;
      background: #3b82f6 !important;
      border-radius: 4px !important;
    }
    .ce-toolbar__plus:hover {
      background: #2563eb !important;
      transform: scale(1.05) !important;
    }
    
    /* Settings button */
    .ce-toolbar__settings-btn {
      color: #e2e8f0 !important;
    }
    .ce-toolbar__settings-btn:hover {
      color: white !important;
      background: #3b82f6 !important;
    }
    
    /* Hover states */
    .ce-toolbar__button:hover {
      color: white !important;
      background: #3b82f6 !important;
    }
    
    /* ===== INLINE TOOLBAR ===== */
    .ce-inline-toolbar {
      background: #ffffff !important;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1) !important;
      border-radius: 6px !important;
    }
    
    .ce-inline-tool {
      color: #4a5568 !important;
    }
    .ce-inline-tool:hover,
    .ce-inline-tool--active {
      color: white !important;
      background: #3b82f6 !important;
    }
    
    /* ===== POPOVER MENUS ===== */
    .ce-popover {
      background: #ffffff !important;
      border-radius: 6px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    }
    
    .ce-popover__item {
      color: #4a5568 !important;
      transition: all 0.1s ease !important;
    }
    .ce-popover__item:hover {
      background: #3b82f6 !important;
      color: white !important;
      transform: translateX(2px);
    }
    
    .ce-popover__item-icon {
      background: #3b82f6 !important;
      border-radius: 4px !important;
    }
    
    /* Active states */
    [class*="--active"] {
      background: #3b82f6 !important;
      color: white !important;
    }
    
    /* Focus states */
    [class*="--focused"] {
      box-shadow: 0 0 0 2px #3b82f6 !important;
    }
  `,
          }}
        />
      </div>
    </div>
  );
};

export default PageEditor;
