
import {ws} from './ConnectionSocket';
ws.onopen = () => {
console.log('Connected to the WebSocket server');
ws.send(JSON.stringify({ type: 'notification' }));
};

ws.onmessage = (event) => {
console.log(event.data);
};