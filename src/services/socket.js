// src/utils/socket.js
import { io } from 'socket.io-client';

const socket = io('https://inventory.nexusutd.online', {
  transports: ['websocket'],
  autoConnect: false,
});

export default socket;
