import { useEffect, useState } from 'react';

const RealTimeEditor = () => {
  const [text, setText] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3333');
    setWs(socket);

    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socket.onmessage = (event) => {
      // Check if the received message is a Blob
      if (event.data instanceof Blob) {
        // If it's a Blob, convert it to text using FileReader
        const reader = new FileReader();
        reader.onload = () => {
          setText(reader.result); // Set the text after Blob is read
        };
        reader.readAsText(event.data); // Read the Blob as text
      } else {
        // If it's not a Blob, assume it's plain text
        setText(event.data); // Update text from server message
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(e.target.value); // Send text to the server
    }
  };

  return (
    <textarea
      className="w-full"
      value={text}
      onChange={handleTextChange}
      placeholder="Start typing..."
    />
  );
};

export default RealTimeEditor;
