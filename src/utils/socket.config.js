import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL, {
  autoConnect: false,
  withCredentials: true,
  path: '/socket.io'
});

export default socket; 