const net = require('net');
const http = require('http');
const ws = require('websocket-stream');

function startMqttServer(tcpPort, wsPort, mqttUser, mqttPassword) {
  const aedes = require('aedes')();

  // authenticate the connecting client
  aedes.authenticate = (client, username, password, callback) => {
      if (password && username) {
        password = Buffer.from(password, 'base64').toString();
        if (username === mqttUser && password === mqttPassword) {
            return callback(null, true);
        }
      }
      const error = new Error('Authentication Failed!! Invalid user credentials.');
      console.log('Error ! Authentication failed.')
      return callback(error, false)
  }

  // authorizing client to publish on a message topic
  aedes.authorizePublish = (client, packet, callback) => {
      if (packet.topic === 'test/topic') {
          return callback(null);
      }
      console.log('Error ! Unauthorized publish to a topic.')
      return callback(new Error('You are not authorized to publish on this message topic.'));
  }

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
