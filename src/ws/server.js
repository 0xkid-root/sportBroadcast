import  {WebSocket, WebSocketServer} from 'ws';

// first create function to send json object to client 

function sendJson(socket,payload){
    if(socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(payload));
}



// creating broadcast function to  send data to every connector user 

function broadcast(wss,payload){
    for(const client of wss.clients){
        if(client.readyState !== WebSocket.open) continue ;
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
        socket.isAlive =true;// here i m creating isAlive varible and setup true

        socket.on('pong',()=>{socket.isAlive = true});


        sendJson(socket,{type:'welcome to the '});

        socket.on('error',console.error);
    });

    const interval =setInterval(()=>{
        
        wss.clients.forEach((ws)=>{
            if(ws.isAlive === false) return ws.terminate();
            ws.isAlive = false;
            ws.ping();
        })},30000);
        wss.on('close',()=>{clearInterval(interval)});



    function broadcastMatchCreated(match){
        broadcast(wss,{type:'match_created',data:match});

    }

    return {
        broadcastMatchCreated
    }




}