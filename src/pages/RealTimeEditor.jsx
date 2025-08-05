import { useEffect, useState, useRef } from 'react';

const RealTimeEditor = ({ pageId = 1, blockId = null }) => {
  const [text, setText] = useState('');
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentBlockId, setCurrentBlockId] = useState(blockId);
  const debounceRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3333');
    setWs(socket);

    socket.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      
      // Join the page session - load existing data for this page
      socket.send(JSON.stringify({
        type: 'join',
        pageId: pageId,
        blockId: blockId
      }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'initial_data':
            // Load existing data and block ID
            setText(data.data || '');
            if (data.blockId) {
              setCurrentBlockId(data.blockId);
            }
            break;
            
          case 'text_update':
            setText(data.content);
            if (data.blockId && !currentBlockId) {
              setCurrentBlockId(data.blockId);
            }
            break;
            
          default:
            // Handle plain text messages (backward compatibility)
            if (typeof event.data === 'string') {
              setText(event.data);
            }
        }
      } catch (error) {
        // Handle Blob or plain text messages
        if (event.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            setText(reader.result);
          };
          reader.readAsText(event.data);
        } else {
          setText(event.data);
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
  }, [pageId, blockId]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce the WebSocket send to avoid too many requests
    debounceRef.current = setTimeout(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'text_update',
          content: newText,
          pageId: pageId,
          blockId: currentBlockId
        }));
      }
    }, 300); // 300ms debounce
  };

  return (
    <div className="p-5 font-sans">
      <div className="flex justify-between items-center mb-2.5 p-2.5 bg-gray-100 rounded-md">
        <span className={`font-bold ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
        <div className="text-sm text-gray-600">
          <span>Page ID: {pageId}</span>
          {currentBlockId && (
            <span className="ml-3">Block ID: {currentBlockId}</span>
          )}
        </div>
      </div>
      
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Start typing to create a new block or edit existing content..."
        className="w-full p-3 border-2 border-gray-300 rounded-md text-sm font-mono resize-y min-h-[200px] focus:outline-none focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
        disabled={!isConnected}
      />
    </div>
  );
};

export default RealTimeEditor;