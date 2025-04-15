import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = {};
    this.reconnectTimer = null;
    this.reconnectInterval = 5000;
  }

  // initialize websocket connection
  connect(onConnected = () => {}, onError = () => {}) {
    if (this.connected) return;
    
    try {
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        debug: function (str) {
          // console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          this.connected = true;
          console.log('웹소켓 연결 성공');
          clearTimeout(this.reconnectTimer);
          onConnected();
          
          // restore saved subscriptions
          Object.entries(this.subscriptions).forEach(([destination, callback]) => {
            this.subscribe(destination, callback);
          });
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame.headers['message']);
          console.error('Additional details:', frame.body);
          this.connected = false;
          onError(frame);
        },
        onDisconnect: () => {
          console.log('STOMP connection disconnected');
          this.connected = false;
        },
        onWebSocketClose: () => {
          console.log('WebSocket connection closed');
          this.connected = false;
        },
        onWebSocketError: (event) => {
          console.error('WebSocket error:', event);
          this.connected = false;
          onError(event);
        }
      });
      
      this.stompClient.activate();
    } catch (error) {
      console.error('WebSocket initialization error:', error);
      onError(error);
    }
  }
  
  // disconnect websocket connection
  disconnect() {
    if (this.stompClient) {
      try {
        this.stompClient.deactivate();
        this.connected = false;
        console.log('WebSocket connection disconnected');
        clearTimeout(this.reconnectTimer);
      } catch (error) {
        console.error('WebSocket disconnection error:', error);
      }
    }
  }
  
  // subscribe to a specific topic
  subscribe(destination, callback) {
    if (!this.stompClient || !this.connected) {
      // if connection is not established, save callback and subscribe later
      this.subscriptions[destination] = callback;
      return null;
    }
    
    try {
      const subscription = this.stompClient.subscribe(destination, (message) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          callback(parsedMessage);
        } catch (error) {
          console.error('Message parsing error:', error);
        }
      });
      
      // save subscription information
      this.subscriptions[destination] = callback;
      return subscription;
    } catch (error) {
      console.error('Subscription error:', error);
      return null;
    }
  }
  
  // unsubscribe from a specific topic
  unsubscribe(destination) {
    if (this.subscriptions[destination]) {
      delete this.subscriptions[destination];
    }
  }
  
  // subscribe to a study group
  subscribeToStudyGroup(groupId, callback) {
    return this.subscribe(`/topic/study-groups/${groupId}`, callback);
  }
  
  // subscribe to all study groups
  subscribeToAllStudyGroups(callback) {
    return this.subscribe(`/topic/study-groups`, callback);
  }
  
  // subscribe to a study spot
  subscribeToStudySpot(spotId, callback) {
    return this.subscribe(`/topic/study-spots/${spotId}`, callback);
  }
  
  // subscribe to all study spots
  subscribeToAllStudySpots(callback) {
    return this.subscribe(`/topic/study-spots`, callback);
  }
}

// create a singleton instance
const websocketService = new WebSocketService();
export default websocketService;