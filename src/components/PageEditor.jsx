const handleCancel = () => {
    // If we created a page during this session, notify parent about it
    if (createdPageData && onPageCreated) {
      onPageCreated(createdPageData.title);
    }
    onCancel && onCancel();
  };import { useState, useRef, useEffect } from 'react';
import { createPage, updatePage, getPageById } from '../apis/pageApi';

const PageEditor = ({ 
  onPageCreated, 
  onCancel, 
  workspaceId, 
  selectedPage = null, // Add selectedPage prop for editing existing pages
  onPageUpdated 
}) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaved, setIsAutoSaved] = useState(false);
  const [createdPageData, setCreatedPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentBlockId, setCurrentBlockId] = useState(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const debounceRef = useRef(null);

  const isEditMode = selectedPage !== null || createdPageData !== null;
  const currentPage = selectedPage || createdPageData;

  useEffect(() => {
    const loadPageContent = async () => {
      if (isEditMode && currentPage) {
        setIsLoading(true);
        try {
          // If we already have the page data, use it
          if (currentPage.title) {
            setTitle(currentPage.title);
            setContent(currentPage.content || '');
          } else {
            // Otherwise fetch the full page data
            const pageData = await getPageById(currentPage.id);
            setTitle(pageData.title || '');
            setContent(pageData.content || '');
          }
        } catch (error) {
          console.error('Error loading page:', error);
          alert('Failed to load page content.');
        } finally {
          setIsLoading(false);
        }
      } else {
        // New page mode - focus on title
        if (titleRef.current) {
          titleRef.current.focus();
        }
      }
    };

    loadPageContent();
  }, [currentPage, isEditMode]);

  // WebSocket connection effect
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3333');
    setWs(socket);

    socket.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      
      // Join the page session
      const pageId = isEditMode ? currentPage.id : `new-${Date.now()}`; // Use timestamp for new pages
      socket.send(JSON.stringify({
        type: 'join',
        pageId: pageId,
        blockId: currentBlockId,
        isNewPage: !isEditMode
      }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'initial_data':
            // Load existing data and block ID (only for edit mode)
            if (isEditMode) {
              setContent(data.data || '');
              if (data.blockId) {
                setCurrentBlockId(data.blockId);
              }
            }
            break;
            
          case 'text_update':
            setContent(data.content);
            if (data.blockId && !currentBlockId) {
              setCurrentBlockId(data.blockId);
            }
            break;
            
          case 'title_update':
            setTitle(data.title);
            break;
            
          default:
            // Handle plain text messages (backward compatibility)
            if (typeof event.data === 'string') {
              setContent(event.data);
            }
        }
      } catch (error) {
        // Handle Blob or plain text messages
        if (event.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            setContent(reader.result);
          };
          reader.readAsText(event.data);
        } else {
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
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      socket.close();
    };
  }, [currentPage?.id, isEditMode]);

  const handleTitleChange = async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // Auto-save page when title is written (for new pages only)
    if (!isEditMode && newTitle.trim() && !isAutoSaved) {
      setIsSaving(true);
      try {
        const createdPage = await createPage(newTitle.trim(), workspaceId);
        setIsAutoSaved(true);
        setCreatedPageData(createdPage); // Switch to edit mode automatically
        // Don't call onPageCreated here to prevent closing the editor
        // onPageCreated && onPageCreated(newTitle.trim());
      } catch (error) {
        console.error('Error auto-saving page:', error);
        alert('Failed to create page. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }

    // Auto-update title for existing pages
    if (isEditMode && currentPage) {
      // Clear existing debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Debounce title updates to avoid too many API calls
      debounceRef.current = setTimeout(async () => {
        try {
          await updatePage(currentPage.id, { title: newTitle.trim(), content });
          const updatedPage = { ...currentPage, title: newTitle.trim() };
          if (createdPageData) {
            setCreatedPageData(updatedPage);
          }
          onPageUpdated && onPageUpdated(updatedPage);
        } catch (error) {
          console.error('Error auto-updating page title:', error);
        }
      }, 500); // 500ms debounce for title auto-save
    }

    // WebSocket real-time update for title
    if (ws && ws.readyState === WebSocket.OPEN) {
      const pageId = isEditMode ? currentPage.id : `new-${Date.now()}`;
      ws.send(JSON.stringify({
        type: 'title_update',
        title: newTitle,
        pageId: pageId,
        blockId: currentBlockId
      }));
    }
  };

  const handleContentChange = async (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Auto-update content for existing pages
    if (isEditMode && currentPage) {
      // Debounce content updates to avoid too many API calls
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        try {
          await updatePage(currentPage.id, { title: title.trim(), content: newContent });
          const updatedPage = { ...currentPage, title: title.trim(), content: newContent };
          if (createdPageData) {
            setCreatedPageData(updatedPage);
          }
          onPageUpdated && onPageUpdated(updatedPage);
        } catch (error) {
          console.error('Error auto-updating page content:', error);
        }
      }, 1000); // 1 second debounce for content auto-save
    }

    // WebSocket real-time update for content
    if (ws && ws.readyState === WebSocket.OPEN) {
      const pageId = isEditMode ? currentPage.id : `new-${Date.now()}`;
      ws.send(JSON.stringify({
        type: 'text_update',
        content: newContent,
        pageId: pageId,
        blockId: currentBlockId
      }));
    }
  };

  const handleKeyDown = (e) => {
    // Cancel on Escape
    if (e.key === 'Escape') {
      handleCancel();
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
            {/* WebSocket connection status */}
            <span className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {/* Auto-save status */}
            {!isEditMode && (
              <span className="text-gray-400 text-sm">
                {isSaving ? 'Creating page...' : isAutoSaved ? 'Page created' : 'Type title to create page'}
              </span>
            )}
            {isEditMode && (
              <span className="text-gray-400 text-sm">
                Auto-saving changes...
              </span>
            )}
            {/* Show page and block ID info */}
            <div className="text-xs text-gray-500">
              <span>Page ID: {isEditMode ? currentPage.id : 'new'}</span>
              {currentBlockId && (
                <span className="ml-3">Block ID: {currentBlockId}</span>
              )}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-[#191919]">
          {/* Title Input */}
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
            placeholder="Untitled"
            className="w-full bg-transparent text-white text-4xl font-bold placeholder-gray-500 border-none outline-none mb-4"
            style={{
              fontSize: '3rem',
              lineHeight: '1.2',
              minHeight: '4rem'
            }}
          />
          
          {/* Content Textarea */}
          <div className="mt-4">
            <textarea
              ref={contentRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="Start writing..."
              className="w-full bg-transparent text-white text-lg placeholder-gray-500 border-none outline-none resize-none"
              style={{
                minHeight: '400px',
                lineHeight: '1.6'
              }} 
              rows={20}
              disabled={!isConnected}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;


// import { useState, useRef, useEffect } from 'react';
// import { createPage, updatePage, getPageById } from '../apis/pageApi';

// const PageEditor = ({ 
//   onPageCreated, 
//   onCancel, 
//   workspaceId, 
//   selectedPage = null,
//   onPageUpdated 
// }) => {
//   const [title, setTitle] = useState('');
//   const [isSaving, setIsSaving] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [editorInstance, setEditorInstance] = useState(null);
//   const titleRef = useRef(null);
//   const editorRef = useRef(null);

//   const isEditMode = selectedPage !== null;

//   useEffect(() => {
//     const initializeEditor = async () => {
//       // Dynamically import Editor.js and plugins
//       const EditorJS = (await import('@editorjs/editorjs')).default;
//       const Header = (await import('@editorjs/header')).default;
//       const List = (await import('@editorjs/list')).default;
//       const Quote = (await import('@editorjs/quote')).default;
//       const Delimiter = (await import('@editorjs/delimiter')).default;
//       const InlineCode = (await import('@editorjs/inline-code')).default;
//       const SimpleImage = (await import('@editorjs/simple-image')).default;
//       const Checklist = (await import('@editorjs/checklist')).default;
//       const Embed = (await import('@editorjs/embed')).default;
//       const Table = (await import('@editorjs/table')).default;

//       // Apply Tailwind-based CSS styles
//       const editorStyles = `
//         <style>
//           .codex-editor { @apply text-gray-200; }
//           .codex-editor__redactor { @apply pb-80; }
//           .ce-block__content, .ce-toolbar__content { @apply max-w-none; }
//           .ce-paragraph { @apply text-gray-200 text-base leading-relaxed my-2; }
//           .ce-paragraph[data-placeholder]:empty::before { @apply text-gray-500; }
//           .ce-header { @apply text-gray-100 font-semibold mt-4 mb-2; }
//           .ce-header[data-placeholder]:empty::before { @apply text-gray-500; }
//           .ce-list { @apply text-gray-200; }
//           .ce-list__item { @apply text-gray-200 leading-relaxed my-1; }
//           .ce-quote { @apply bg-gray-800 bg-opacity-30 border-l-4 border-blue-500 text-gray-200 my-4 p-4 rounded-r; }
//           .ce-quote__text { @apply text-gray-200 text-lg italic; }
//           .ce-quote__caption { @apply text-gray-400 text-sm; }
//           .ce-delimiter { @apply border-t border-gray-600 my-8 relative; }
//           .ce-delimiter::before { @apply text-gray-500; }
//           .cdx-checklist__item { @apply text-gray-200; }
//           .cdx-checklist__item-checkbox { @apply border-2 border-gray-500 bg-transparent rounded; }
//           .cdx-checklist__item-checkbox:checked { @apply bg-blue-500 border-blue-500; }
//           .cdx-checklist__item--checked .cdx-checklist__item-text { @apply text-gray-400 line-through; }
//           .ce-toolbar__plus { @apply text-gray-200 bg-transparent border-none hover:text-gray-200 hover:bg-gray-200 hover:bg-opacity-50 rounded; }
//           .ce-toolbar__settings-btn { @apply text-gray-500 bg-transparent border-none hover:text-gray-200 hover:bg-gray-700 hover:bg-opacity-50 rounded; }
//           .ce-popover { @apply bg-gray-800 border border-gray-600 shadow-2xl text-gray-200 rounded-lg; }
//           .ce-popover__item { @apply text-gray-200 rounded-md hover:bg-gray-700; }
//           .ce-popover__item-icon { @apply bg-transparent text-gray-400; }
//           .ce-popover__item-label { @apply text-gray-200; }
//           .ce-popover__item-secondary-label { @apply text-gray-400; }
//           .ce-conversion-toolbar { @apply bg-gray-800 border border-gray-600 shadow-2xl rounded-lg; }
//           .ce-conversion-tool { @apply text-gray-200 hover:bg-gray-700 rounded; }
//           .ce-inline-toolbar { @apply bg-gray-800 border border-gray-600 shadow-2xl rounded-lg; }
//           .ce-inline-tool { @apply text-gray-200 rounded hover:bg-gray-700; }
//           .ce-inline-tool--active { @apply bg-blue-500 text-white; }
//           .tc-table { @apply border-collapse w-full my-4; }
//           .tc-row { @apply border-b border-gray-600; }
//           .tc-cell { @apply border border-gray-600 p-3 text-gray-200 bg-transparent; }
//           .tc-cell--selected { @apply bg-blue-500 bg-opacity-10; }
//           .simple-image { @apply my-4; }
//           .simple-image__picture { @apply rounded-lg max-w-full; }
//           .embed-tool { @apply my-4; }
//           .embed-tool__content { @apply rounded-lg overflow-hidden; }
//           .ce-block--selected .ce-block__content { @apply bg-blue-500 bg-opacity-10 rounded; }
//           .ce-block:hover .ce-block__content { @apply bg-gray-700 bg-opacity-20 rounded; }
//           [data-placeholder]:empty:not(:focus):before { @apply text-gray-500 font-normal; }
//         </style>
//       `;

//       // Inject styles into head
//       const styleElement = document.createElement('div');
//       styleElement.innerHTML = editorStyles;
//       document.head.appendChild(styleElement.firstElementChild);

//       const editor = new EditorJS({
//         holder: editorRef.current,
//         placeholder: 'Press Tab or click here to write...',
//         tools: {
//           header: {
//             class: Header,
//             config: {
//               placeholder: 'Enter a header',
//               levels: [1, 2, 3, 4, 5, 6],
//               defaultLevel: 2
//             }
//           },
//           list: {
//             class: List,
//             inlineToolbar: true,
//             config: {
//               defaultStyle: 'unordered'
//             }
//           },
//           checklist: {
//             class: Checklist,
//             inlineToolbar: true,
//           },
//           quote: {
//             class: Quote,
//             inlineToolbar: true,
//             shortcut: 'CMD+SHIFT+O',
//             config: {
//               quotePlaceholder: 'Enter a quote',
//               captionPlaceholder: 'Quote\'s author',
//             },
//           },
//           delimiter: Delimiter,
//           inlineCode: {
//             class: InlineCode,
//             shortcut: 'CMD+SHIFT+M',
//           },
//           simpleImage: {
//             class: SimpleImage,
//           },
//           embed: {
//             class: Embed,
//             config: {
//               services: {
//                 youtube: true,
//                 coub: true,
//                 codepen: true,
//               }
//             }
//           },
//           table: {
//             class: Table,
//             inlineToolbar: true,
//             config: {
//               rows: 2,
//               cols: 3,
//             },
//           },
//         },
//         data: {},
//         onReady: () => {
//           console.log('Editor.js is ready to work!');
//         },
//         onChange: (api, event) => {
//           console.log('Content was changed', event);
//         },
//         autofocus: false,
//       });

//       setEditorInstance(editor);

//       // Load page content if in edit mode
//       if (isEditMode && selectedPage) {
//         setIsLoading(true);
//         try {
//           let pageData;
//           if (selectedPage.title && selectedPage.content) {
//             pageData = selectedPage;
//           } else {
//             pageData = await getPageById(selectedPage.id);
//           }
          
//           setTitle(pageData.title || '');
          
//           // Parse content for Editor.js
//           if (pageData.content) {
//             try {
//               const parsedContent = JSON.parse(pageData.content);
//               await editor.render(parsedContent);
//             } catch (e) {
//               // If content is not JSON, create a simple paragraph block
//               await editor.render({
//                 blocks: [
//                   {
//                     type: 'paragraph',
//                     data: {
//                       text: pageData.content
//                     }
//                   }
//                 ]
//               });
//             }
//           }
//         } catch (error) {
//           console.error('Error loading page:', error);
//           alert('Failed to load page content.');
//         } finally {
//           setIsLoading(false);
//         }
//       } else {
//         // New page mode - focus on title
//         if (titleRef.current) {
//           titleRef.current.focus();
//         }
//       }
//     };

//     initializeEditor();

//     // Cleanup
//     return () => {
//       if (editorInstance) {
//         editorInstance.destroy();
//       }
//     };
//   }, [selectedPage, isEditMode]);

//   const handleTitleChange = (e) => {
//     setTitle(e.target.value);
//   };

//   const handleSave = async () => {
//     if (!title.trim()) {
//       alert('Please enter a title for the page.');
//       return;
//     }

//     if (!editorInstance) {
//       alert('Editor is not ready. Please try again.');
//       return;
//     }

//     setIsSaving(true);
//     try {
//       // Get editor content
//       const outputData = await editorInstance.save();
//       const contentString = JSON.stringify(outputData);

//       if (isEditMode) {
//         // Update existing page
//         await updatePage(selectedPage.id, { 
//           title: title.trim(), 
//           content: contentString 
//         });
//         onPageUpdated && onPageUpdated({ 
//           ...selectedPage, 
//           title: title.trim(), 
//           content: contentString 
//         });
//       } else {
//         // Create new page
//         await createPage(title.trim(), workspaceId, contentString);
//         onPageCreated && onPageCreated(title.trim());
//       }
//     } catch (error) {
//       console.error('Error saving page:', error);
//       alert(`Failed to ${isEditMode ? 'update' : 'create'} page. Please try again.`);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     // Save on Ctrl+S or Cmd+S
//     if ((e.ctrlKey || e.metaKey) && e.key === 's') {
//       e.preventDefault();
//       handleSave();
//     }
//     // Cancel on Escape
//     if (e.key === 'Escape') {
//       onCancel && onCancel();
//     }
//     // Focus editor on Tab from title
//     if (e.key === 'Tab' && e.target === titleRef.current) {
//       e.preventDefault();
//       if (editorInstance) {
//         editorInstance.focus();
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex-1 p-6 bg-[#191919] min-h-screen">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-gray-400 flex items-center space-x-2">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
//             <span>Loading page...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 bg-[#191919] min-h-screen">
//       {/* Toolbar */}
//       <div className="sticky top-0 z-10 bg-[#191919] border-b border-gray-800 px-6 py-4">
//         <div className="max-w-4xl mx-auto flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={onCancel}
//               className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800"
//             >
//               <span>←</span>
//               <span>Back</span>
//             </button>
//             <span className="text-gray-500 text-sm bg-gray-800 px-3 py-1 rounded-full">
//               {isEditMode ? 'Editing page' : 'New page'}
//             </span>
//           </div>
//           <div className="flex items-center space-x-3">
//             <span className="text-gray-400 text-sm hidden sm:block">
//               Ctrl+S to save
//             </span>
//             <button
//               onClick={handleSave}
//               disabled={!title.trim() || isSaving}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-lg"
//             >
//               {isSaving ? (
//                 <div className="flex items-center space-x-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   <span>Saving...</span>
//                 </div>
//               ) : (
//                 'Save'
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Editor Content */}
//       <div className="px-6 py-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Title Input */}
//           <input
//             ref={titleRef}
//             type="text"
//             value={title}
//             onChange={handleTitleChange}
//             onKeyDown={handleKeyDown}
//             placeholder="Untitled"
//             className="w-full bg-transparent text-gray-100 text-5xl font-bold placeholder-gray-600 border-none outline-none mb-8 leading-tight focus:placeholder-gray-500 transition-colors"
//             style={{
//               fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
//             }}
//           />
          
//           {/* Editor.js Container */}
//           <div 
//             ref={editorRef}
//             className="prose prose-invert prose-lg max-w-none min-h-96 focus-within:outline-none"
//             style={{
//               fontSize: '16px',
//               lineHeight: '1.6',
//               color: '#e5e7eb'
//             }}
//           />
          
//           {/* Empty state hint */}
//           {!isEditMode && (
//             <div className="mt-8 text-gray-500 text-sm text-center">
//               <p>Press <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Tab</kbd> to start writing, or click above</p>
//               <p className="mt-2">Use <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">/</kbd> to add blocks like headers, lists, and more</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PageEditor;