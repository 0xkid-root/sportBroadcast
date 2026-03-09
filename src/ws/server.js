import  {WebSocket} from 'ws';

// first create function to send json object to client 

function sendJson(socket,payload){
    if(socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(payload));
}



// creating broadcast function to  send data to every connector user 

function broadcast(wss,payload){
    for(const client of wss.clients){
        if(client.readyState !== WebSocket.open) return ;
        client.send(JSON.stringify(payload));
    }
}

//attach websocket logic TO SERVER

export function attachWebSocketServer(server){

    // here i m creating websocket server and passing express http server 
    const wss = new WebSocketServer({
        server,
        path:'/ws', // this is the path where websocket server is listening
        maxPayload:1024 *1024,
    })

    wss.on('connection',(socket)=>{
        console.log('new client connected',socket.id);
        sendJson(socket,{type:'welcome to the '});

        socket.on('error',console.error);
    });

    function broadcastMatchCreated(match){
        broadcast(wss,{type:'match_created',data:match});

    }

    return {
        broadcastMatchCreated
    }




}