import { WEBSOCKET_BASE_URL } from '/Users/gealoro/kakaw/frontend/lib/api';
import { useRouter } from 'next/router'
import Link from 'next/link';
import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

//import './App.css';
const WS_URL = WEBSOCKET_BASE_URL

/*/
function App() {
useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    }
  });

  return (
    <div>Hello WebSockets!</div>
  );
}
/*/

function ConnectPage() {

  useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    }
  });

    const router = useRouter();
    const { gameId, playerId } = router.query;
  
    // render the page component with the query parameters
    return (
      <div>
        <h1>Connect Page</h1>
        <p>Game ID: {gameId}</p>
        <p>Player ID: {playerId}</p>
      </div>
    );
  }
  
  export default ConnectPage;
  
  function MyComponent() {
    const gameId = '123';
    const playerId = '456';
  
    return (
      <Link href={`/connect?gameId=${gameId}&playerId=${playerId}`}>
        <a>Connect</a>
      </Link>
    );
  }