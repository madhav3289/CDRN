import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

/**
 * Connect to the backend WebSocket endpoint using SockJS + STOMP.
 * Subscribes to three topics and invokes the corresponding callbacks
 * whenever a message arrives.
 *
 * @param {Function} onIncident - called with parsed incident data
 * @param {Function} onAlert    - called with parsed alert data
 * @param {Function} onTask     - called with parsed task data
 */
export function connect(onIncident, onAlert, onTask) {
  stompClient = new Client({
    // Use SockJS as the underlying transport
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    reconnectDelay: 5000,
    debug: () => {}, // silence debug logs

    onConnect: () => {
      console.log('WebSocket connected');

      // Subscribe to live incident updates
      if (onIncident) {
        stompClient.subscribe('/topic/incidents', (message) => {
          try {
            onIncident(JSON.parse(message.body));
          } catch (e) {
            console.error('Failed to parse incident message', e);
          }
        });
      }

      // Subscribe to live alert updates
      if (onAlert) {
        stompClient.subscribe('/topic/alerts', (message) => {
          try {
            onAlert(JSON.parse(message.body));
          } catch (e) {
            console.error('Failed to parse alert message', e);
          }
        });
      }

      // Subscribe to live task updates
      if (onTask) {
        stompClient.subscribe('/topic/tasks', (message) => {
          try {
            onTask(JSON.parse(message.body));
          } catch (e) {
            console.error('Failed to parse task message', e);
          }
        });
      }
    },

    onStompError: (frame) => {
      console.error('STOMP error:', frame.headers['message']);
    },
  });

  stompClient.activate();
}

/**
 * Cleanly disconnect from the WebSocket.
 */
export function disconnect() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log('WebSocket disconnected');
  }
}
