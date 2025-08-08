import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const WebSocketConnection = ({
  workspaceId,
  isEditMode,
  currentPage,
  currentBlockId,
  setContent,
  setIsConnected,
}) => {
  const [ws, setWs] = useState(null);

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
          case 'text_update':
            const newContent = data.content;
            if (newContent !== content) {
              setContent(newContent);
            }
            break;

          default:
            break;
        }
      } catch (error) {
        console.error('WebSocket error:', error);
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

  return null; // This component doesn't need to render anything itself
};

export default WebSocketConnection;
