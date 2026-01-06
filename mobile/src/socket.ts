import { io } from 'socket.io-client';

export const socket = io('http://YOUR_LOCAL_IP:4000', {
  transports: ['websocket'],
});
