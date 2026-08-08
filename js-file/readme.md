## Build
``docker build -t kuduiso/combined-mqtt-ws-server:latest .``

``docker run -d --name combined-server -p 8080:8080 -p 1883:1883 -p 8883:8883 -e MQTT_USERNAME=<USERNAME> -e MQTT_PASSWORD=<STRONG_PASSWORD> kuduiso/combined-mqtt-ws-server:latest``

``docker push kuduiso/combined-mqtt-ws-server:latest``

## Test
- Websocket

``npx wscat -c ws://localhost:8080``

- MQTT

``npm install -g mqtt``

``mqtt sub -t 'test/topic' -h localhost -p 1883``

``mqtt sub -t 'test/topic' -h localhost -p 1883 -u <USERNAME> --password <PASSWORD>``

``mqtt pub -t 'test/topic' -m 'hello' -h localhost -p 1883``

``mqtt pub -t 'test/topic' -m 'hello' -h localhost -p 1883 -u <USERNAME> --password <PASSWORD>``

- MQTT (Websocket)

Subscribe (terminal 1)

``mqtt sub -t 'test/topic' --url ws://localhost:8883``

``mqtt sub -h <hostname> -p 443 -l wss --insecure -t 'test/topic'``

Publish (terminal 2)

``mqtt pub -t 'test/topic' -m 'hello over ws' --url ws://localhost:8883``

``mqtt pub -h <hostname> -p 443 -l wss --insecure -t
 'test/topic' -m 'Hello from MQTT'``

- Check Log Output

``docker logs -f <container-name-or-id>``

- Test with CURL

``curl -vk \
  --http1.1 \
  -H "Origin: null" \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13" \
  -H "Sec-WebSocket-Key: SGVsbG9XZWJTb2NrZXQ=" \
  https://<HOSTNAME>/``

  ## Run HTTP Server Localhost with Python3
  ``python3 -m http.server 8080``