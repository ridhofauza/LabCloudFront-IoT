FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY index.js websocket-server.js mqtt-server.js ./

# 8080 = WebSocket broadcast server
# 1883 = MQTT (TCP)
# 8883 = MQTT over WebSocket
EXPOSE 8080 1883 8883

ENV WS_PORT=8080
ENV MQTT_PORT=1883
ENV MQTT_WS_PORT=8883

CMD ["node", "index.js"]
