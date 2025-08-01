// import { useEffect, useState, useRef } from 'react';

// const RealTimeEditor = ({ pageId, blockId = null }) => {
//   const [text, setText] = useState('');
//   const [ws, setWs] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [currentBlockId, setCurrentBlockId] = useState(blockId);
//   const debounceRef = useRef(null);

//   useEffect(() => {
//     const socket = new WebSocket('ws://localhost:3333');
//     setWs(socket);

//     socket.onopen = () => {
//       console.log('Connected to WebSocket');
//       setIsConnected(true);
      
//       // Join the page/block session
//       socket.send(JSON.stringify({
//         type: 'join',
//         pageId: pageId,
//         blockId: blockId
//       }));
//     };

//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
        
//         switch (data.type) {
//           case 'initial_data':
//             setText(data.data || '');
//             break;
            
//           case 'text_update':
//             setText(data.content);
//             if (data.blockId && !currentBlockId) {
//               setCurrentBlockId(data.blockId);
//             }
//             break;
            
//           default:
//             // Handle plain text messages (backward compatibility)
//             if (typeof event.data === 'string') {
//               setText(event.data);
//             }
//         }
//       } catch (error) {
//         // Handle Blob or plain text messages
//         if (event.data instanceof Blob) {
//           const reader = new FileReader();
//           reader.onload = () => {
//             setText(reader.result);
//           };
//           reader.readAsText(event.data);
//         } else {
//           setText(event.data);
//         }
//       }
//     };

//     socket.onclose = () => {
//       console.log('WebSocket connection closed');
//       setIsConnected(false);
//     };

//     socket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//       setIsConnected(false);
//     };

//     return () => {
//       if (debounceRef.current) {
//         clearTimeout(debounceRef.current);
//       }
//       socket.close();
//     };
//   }, [pageId, blockId]);

//   const handleTextChange = (e) => {
//     const newText = e.target.value;
//     setText(newText);

//     // Clear existing debounce
//     if (debounceRef.current) {
//       clearTimeout(debounceRef.current);
//     }

//     // Debounce the WebSocket send to avoid too many requests
//     debounceRef.current = setTimeout(() => {
//       if (ws && ws.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify({
//           type: 'text_update',
//           content: newText,
//           pageId: pageId,
//           blockId: currentBlockId
//         }));
//       }
//     }, 300); // 300ms debounce
//   };

//   return (
//     <div className="p-5 font-sans">
//       <div className="flex justify-between items-center mb-2.5 p-2.5 bg-gray-100 rounded-md">
//         <span className={`font-bold ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
//           {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
//         </span>
//         {currentBlockId && (
//           <span className="text-sm text-gray-600">Block ID: {currentBlockId}</span>
//         )}
//       </div>
      
//       <textarea
//         value={text}
//         onChange={handleTextChange}
//         placeholder="Start typing to create a new block or edit existing content..."
//         className="w-full p-3 border-2 border-gray-300 rounded-md text-sm font-mono resize-y min-h-[200px] focus:outline-none focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
//         disabled={!isConnected}
//       />
//     </div>
//   );
// };

// export default RealTimeEditor;
import { useEffect, useState, useRef } from 'react';

const RealTimeEditor = ({  }) => {
  const [editorData, setEditorData] = useState({ blocks: [] });
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const pageId=1;
  const blockId = '199799f3-13af-4e96-8199-fa6f695c6cad';
  const [currentBlockId, setCurrentBlockId] = useState(blockId);
  const [editor, setEditor] = useState(null);
  const debounceRef = useRef(null);
  const editorRef = useRef(null);
  const isUpdatingFromWS = useRef(false);

  // Initialize Editor.js
  useEffect(() => {
    const initEditor = async () => {
      // Load Editor.js and plugins from CDN
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      try {
        // Load Editor.js core
        await loadScript('https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.28.2/dist/editorjs.umd.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@editorjs/header@2.7.0/dist/bundle.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@editorjs/list@1.8.0/dist/bundle.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@editorjs/quote@2.5.0/dist/bundle.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@editorjs/code@2.8.0/dist/bundle.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@editorjs/marker@1.3.0/dist/bundle.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@editorjs/inline-code@1.4.0/dist/bundle.js');

        // Wait a bit for scripts to initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        const EditorJS = window.EditorJS;
        const Header = window.Header;
        const List = window.List;
        const Quote = window.Quote;
        const Code = window.CodeTool;
        const Marker = window.Marker;
        const InlineCode = window.InlineCode;

        const editorInstance = new EditorJS({
          holder: editorRef.current,
          placeholder: 'Start typing to create a new block or edit existing content...',
          tools: {
            header: {
              class: Header,
              config: {
                placeholder: 'Enter a header',
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2
              }
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: 'unordered'
              }
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              config: {
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: 'Quote\'s author',
              }
            },
            code: {
              class: Code,
              config: {
                placeholder: 'Enter code here...'
              }
            },
            marker: {
              class: Marker,
              shortcut: 'CMD+SHIFT+M'
            },
            inlineCode: {
              class: InlineCode,
              shortcut: 'CMD+SHIFT+C'
            }
          },
          data: editorData,
          onChange: async (api, event) => {
            if (isUpdatingFromWS.current) {
              return;
            }

            try {
              const content = await api.saver.save();
              setEditorData(content);

              // Clear existing debounce
              if (debounceRef.current) {
                clearTimeout(debounceRef.current);
              }

              // Debounce the WebSocket send
              debounceRef.current = setTimeout(() => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({
                    type: 'text_update',
                    content: JSON.stringify(content),
                    pageId: pageId,
                    blockId: currentBlockId
                  }));
                }
              }, 300);
            } catch (error) {
              console.error('Error saving editor content:', error);
            }
          },
          onReady: () => {
            console.log('Editor.js is ready');
          }
        });

        setEditor(editorInstance);
      } catch (error) {
        console.error('Failed to load Editor.js:', error);
        // Fallback to a simple contentEditable div if Editor.js fails to load
        setEditor({ isSimple: true });
      }
    };

    if (editorRef.current && !editor) {
      initEditor().catch(console.error);
    }

    return () => {
      if (editor && editor.destroy && typeof editor.destroy === 'function') {
        editor.destroy();
      }
    };
  }, []);

  // WebSocket connection
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3333');
    setWs(socket);

    socket.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      
      // Join the page/block session
      socket.send(JSON.stringify({
        type: 'join',
        pageId: pageId,
        blockId: blockId
      }));
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'initial_data':
            if (data.data) {
              try {
                const parsedData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
                if (parsedData && parsedData.blocks) {
                  setEditorData(parsedData);
                  if (editor && editor.render) {
                    isUpdatingFromWS.current = true;
                    await editor.render(parsedData);
                    isUpdatingFromWS.current = false;
                  }
                }
              } catch (parseError) {
                console.warn('Could not parse initial data as JSON, treating as plain text');
                const textData = {
                  blocks: [{
                    type: 'paragraph',
                    data: { text: data.data }
                  }]
                };
                setEditorData(textData);
                if (editor && editor.render) {
                  isUpdatingFromWS.current = true;
                  await editor.render(textData);
                  isUpdatingFromWS.current = false;
                }
              }
            }
            break;
            
          case 'text_update':
            try {
              const parsedContent = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
              if (parsedContent && parsedContent.blocks) {
                setEditorData(parsedContent);
                if (editor && editor.render && !editor.isSimple) {
                  isUpdatingFromWS.current = true;
                  await editor.render(parsedContent);
                  isUpdatingFromWS.current = false;
                }
              }
              if (data.blockId && !currentBlockId) {
                setCurrentBlockId(data.blockId);
              }
            } catch (parseError) {
              console.warn('Could not parse content as JSON, treating as plain text');
              const textData = {
                blocks: [{
                  type: 'paragraph',
                  data: { text: data.content }
                }]
              };
              setEditorData(textData);
              if (editor && editor.render && !editor.isSimple) {
                isUpdatingFromWS.current = true;
                await editor.render(textData);
                isUpdatingFromWS.current = false;
              }
            }
            break;
            
          default:
            // Handle plain text messages (backward compatibility)
            if (typeof event.data === 'string') {
              const textData = {
                blocks: [{
                  type: 'paragraph',
                  data: { text: event.data }
                }]
              };
              setEditorData(textData);
              if (editor && editor.render) {
                isUpdatingFromWS.current = true;
                await editor.render(textData);
                isUpdatingFromWS.current = false;
              }
            }
        }
      } catch (error) {
        // Handle Blob or plain text messages
        if (event.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = async () => {
            const textData = {
              blocks: [{
                type: 'paragraph',
                data: { text: reader.result }
              }]
            };
            setEditorData(textData);
            if (editor && editor.render && !editor.isSimple) {
              isUpdatingFromWS.current = true;
              await editor.render(textData);
              isUpdatingFromWS.current = false;
            }
          };
          reader.readAsText(event.data);
        } else {
          const textData = {
            blocks: [{
              type: 'paragraph',
              data: { text: event.data }
            }]
          };
          setEditorData(textData);
          if (editor && editor.render) {
            isUpdatingFromWS.current = true;
            await editor.render(textData);
            isUpdatingFromWS.current = false;
          }
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
  }, [pageId, blockId, editor]);

  return (
    <div className="p-5 font-sans max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg border">
        <span className={`font-semibold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
        {currentBlockId && (
          <span className="text-sm text-gray-600 font-mono">Block ID: {currentBlockId}</span>
        )}
      </div>
      
      <div 
        className={`
          bg-white border border-gray-200 rounded-lg shadow-sm min-h-[400px] p-6
          ${!isConnected ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <div 
          ref={editorRef}
          className="prose prose-slate max-w-none"
          style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#374151'
          }}
        />
      </div>
      
      {!isConnected && (
        <div className="mt-3 text-center text-sm text-gray-500">
          Editor is disabled while disconnected from server
        </div>
      )}
    </div>
  );
};

export default RealTimeEditor;