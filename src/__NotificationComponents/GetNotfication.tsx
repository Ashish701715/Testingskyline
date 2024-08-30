import {ws} from './ConnectionSocket';
function getNotificationData(){
    ws.onopen = () => {
        console.log('Connected to the WebSocket server');
        ws.send(JSON.stringify({ type: 'notification' }));
    };
    
    ws.onmessage = (event) => {
        return "hello user"
    };
}

export default getNotificationData;