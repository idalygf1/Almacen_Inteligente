// src/services/socket.js
import { io } from 'socket.io-client';

const socket = io('https://inventory.nexusutd.online', {
  transports: ['websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
