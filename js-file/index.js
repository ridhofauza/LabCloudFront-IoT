const { startWebSocketServer } = require('./websocket-server');
const { startMqttServer } = require('./mqtt-server');

const WS_PORT = process.env.WS_PORT || 8080;
const MQTT_TCP_PORT = process.env.MQTT_PORT || 1883;
const MQTT_WS_PORT = process.env.MQTT_WS_PORT || 8883;
const MQTT_USERNAME = process.env.MQTT_USERNAME || 'guest';
const MQTT_PASSWORD = process.env.MQTT_PASSWORD || '12345678';

startWebSocketServer(WS_PORT);
startMqttServer(MQTT_TCP_PORT, MQTT_WS_PORT, MQTT_USERNAME, MQTT_PASSWORD);

console.log('--- All servers started ---');
