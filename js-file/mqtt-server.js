const net = require('net');
const http = require('http');
const ws = require('websocket-stream');

function startMqttServer(tcpPort, wsPort) {
  const aedes = require('aedes')();

  const tcpServer = net.createServer(aedes.handle);
  tcpServer.listen(tcpPort, () => {
    console.log(`[mqtt] MQTT broker (TCP) running on mqtt://localhost:${tcpPort}`);
  });

  const httpServer = http.createServer();
  ws.createServer({ server: httpServer }, aedes.handle);
  httpServer.listen(wsPort, () => {
    console.log(`[mqtt] MQTT broker (WebSocket) running on ws://localhost:${wsPort}`);
  });

  aedes.on('client', (client) => {
    console.log(`[mqtt] Client connected: ${client.id}`);
  });

  aedes.on('clientDisconnect', (client) => {
    console.log(`[mqtt] Client disconnected: ${client.id}`);
  });

  aedes.on('subscribe', (subscriptions, client) => {
    if (client) {
      console.log(`[mqtt] ${client.id} subscribed to:`, subscriptions.map(s => s.topic).join(', '));
    }
  });

  aedes.on('publish', (packet, client) => {
    if (client) {
      console.log(`[mqtt] ${client.id} published to "${packet.topic}": ${packet.payload.toString()}`);
    }
  });

  aedes.on('clientError', (client, err) => {
    console.error(`[mqtt] Client error (${client.id}):`, err.message);
  });

  return aedes;
}

module.exports = { startMqttServer };
