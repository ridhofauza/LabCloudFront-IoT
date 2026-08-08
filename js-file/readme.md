## Build
``docker build -t combined-mqtt-ws-server .``

``docker run -p 8080:8080 -p 1883:1883 -p 8883:8883 combined-mqtt-ws-server``

## Test
- Websocket

``npx wscat -c ws://localhost:8080``

- MQTT

``npm install -g mqtt``

``mqtt sub -t 'test/topic' -h localhost -p 1883``

``mqtt pub -t 'test/topic' -m 'hello' -h localhost -p 1883``

- MQTT (Websocket)

Subscribe (terminal 1)

``mqtt sub -t 'test/topic' --url ws://localhost:8883``

Publish (terminal 2)

``mqtt pub -t 'test/topic' -m 'hello over ws' --url ws://localhost:8883``

- Check Log Output

``docker logs -f <container-name-or-id>``