const WebSocket = require('ws');

function startWebSocketServer(port) {
  const wss = new WebSocket.Server({ port });
  let clientId = 0;

  wss.on('connection', (ws) => {
    ws.id = ++clientId;
    console.log(`[ws] Client ${ws.id} connected. Total: ${wss.clients.size}`);

    ws.send(JSON.stringify({ type: 'welcome', message: `Connected as client ${ws.id}` }));

    ws.on('message', (data) => {
      let msg;
      try {
        msg = JSON.parse(data);
      } catch {
        msg = { type: 'message', text: data.toString() };
      }

      console.log(`[ws] Received from client ${ws.id}:`, msg);

      const payload = JSON.stringify({
        type: 'message',
        from: ws.id,
        text: msg.text ?? msg,
        timestamp: Date.now()
      });

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      });
    });

    ws.on('close', () => {
      console.log(`[ws] Client ${ws.id} disconnected. Total: ${wss.clients.size - 1}`);
    });

    ws.on('error', (err) => {
      console.error(`[ws] Client ${ws.id} error:`, err.message);
    });
  });

  console.log(`[ws] WebSocket server running on ws://localhost:${port}`);
  return wss;
}

module.exports = { startWebSocketServer };
