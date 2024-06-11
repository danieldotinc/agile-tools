import io from 'socket.io-client';

const socket = io(process.env.WEBSITE_URI!);

export default socket;
