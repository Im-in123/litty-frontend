
import { WEBSOCKET_URL} from '../../urls';

class WebSocketService {

    constructor(){
        this.socketRef = null;
        this.check = false
    }

    static instance  = null;
    callbacks = {};

    static getInstance() {
        if (!WebSocketService.instance){
            WebSocketService.instance  = new WebSocketService();
            // WebSocketService.instance.connect()
        }
        return WebSocketService.instance;
    }



    

    connect(url){
        //WEBSOCKET_URL
        const path = url //'ws://127.0.0.1:8000/ws/chat/123/';
        this.socketRef = new WebSocket(path);

        this.socketRef.onopen = () => {
            console.log ('Websocket open');
            
        };
        
        this.socketNewMessage(JSON.stringify({
            command: 'fetch_messages'
        })) 

        this.socketRef.onmessage = e => {
            // console.log ('Websocket message:::', e.data);
            if(e.data){
                this.socketNewMessage(e.data)
            }

        };
        this.socketRef.onerror = e => {
            console.log(e.message);
        };
        this.socketRef.onclose = () => {
            console.log('Websocket is closed');
            if(this.check){
                    console.log("passed")
                    this.check=false

            }else{
                console.log("not passed")
                this.check=false
                this.connect(path);

            }
        };
    }
    hardclose(){
        try {
            this.check = true
            this.socketRef.close()
            console.log('did hard close');

        // this.socketRef=null
        // console.log('did hard null');
        // // this.check = false

        } catch (error) {
            console.log("hard error")
        }
        

    }

    socketNewMessage(data){
        const parsedData  =JSON.parse(data);
        const command = parsedData.command;

        if (Object.keys(this.callbacks).length === 0){
            console.log("shit happened here")
            return;
        }
        if (command === 'messages'){
            // console.log("shit happened here")

            this.callbacks[command](parsedData.messages);

        }
        if (command === 'new_message'){
            console.log("here")

            this.callbacks[command](parsedData.message);

        }
    };

    fetchMessages(username, other_person){
        this.sendMessage({command: 'fetch_messages', username: username, other_person:other_person});
    }

    newChatMessage(message){
        // console.log("main newchatmessgae:::", message)
        this.sendMessage({command: 'new_message', from:message.from,  message: message.content, to:message.to});
    }

    addCallbacks(messagesCallback, newMessageCallback){
        this.callbacks['messages'] = messagesCallback;
        this.callbacks['new_message'] = newMessageCallback;

    }

    sendMessage(data){
        try{
            this.socketRef.send(JSON.stringify({...data}))
        }catch (err){
            console.log(err.message)
        }
    }
    waitForSocketConnection(callback){
        const socket = this.socketRef;
        const recursion = this.waitForSocketConnection;
        setTimeout(
            function(){
                if (socket.readyState === 1){
                    console.log("Connection is secure");
                    if (callback != null){
                        callback();
                    }
                    return;

                }else{
                    console.log("Waiting for conection inner...")
                    recursion(callback)

                }
            }, 1);
    }
}
const WebSocketInstance = WebSocketService.getInstance();
export default WebSocketInstance;
// export default WebSocket;