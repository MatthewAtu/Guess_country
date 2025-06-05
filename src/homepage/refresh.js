import React, { useState, useEffect } from 'react';

const WebSocketComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('wss://example.com/socket');//get api link

    ws.onmessage = (event) => {
      const result = JSON.parse(event.data);
      setData(result);
    };

    return () => {
      ws.close(); // Cleanup on component unmount
    };
  }, []);

  return (
    <div>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
    </div>
  );
};

export default WebSocketComponent;
