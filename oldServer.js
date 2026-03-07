import { WebSocketServer,WebSocket } from "ws";

// Create a new WebSocket server listening on port 8000
const wss = new WebSocketServer({port:8000});

//deail with frist event connection

{/**
    -socket is contain invidiusal connection of one client
    -request is contain header such as cookie,ipaddress andmore

    */}

wss.on('connection',(socket,request)=>{
    console.log('Client connected');
    // here i find remote ip address
    const ip = request.socket.remoteAddress;

    socket.on('message',(rawData)=>{
        console.log('Received data:', rawData);
        const message = rawData.toString();

        wss.clients.forEach((client)=>{
            if(client.readyState === WebSocket.OPEN) client.send(`Server Broadcast:${message}`);
        })

    });

    socket.on('error',(err)=>{
        console.error(`Error ${err.message}: ${ip}`);

    })

    socket.on('close',()=>{
        console.log('Client disconnected');
    })



})

console.log('WebSocket server is listening on port 8000')
