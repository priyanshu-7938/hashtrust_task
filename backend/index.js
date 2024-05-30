import express from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import url from 'url';
import 'dotenv/config';

const subscribeRequest = JSON.stringify({
    "jsonrpc": "2.0",
    "id": 1,
    "method": "eth_subscribe",
    "params": ["newHeads"]
});
let currentSub = '';//by default its none.....

const app = express();

const server = app.listen(3002, () => {
    console.log('Server is running on port 3002');
});

const socket = new WebSocketServer({ server });
// console.log(socket);
//constants to handle the users....
const connections = {}
const handleClose = (uid)=>{
    delete connections[uid];
    if(Object.keys(connections).length == 0){
        //meaning everyon disconnected...
        // unsubscribing to the infura...
        wss.send( `{
                "jsonrpc": "2.0",
                "id": 1,
                "method": "eth_unsubscribe",
                "params": ["${currentSub}"]
            }`);
        console.log("Unsubscribed to infura...");
    }
}
socket.on('connection',(connection, request)=>{
    
    // console.log(request);
    const { uuid } = url.parse(request.url,true).query;
    console.log(uuid);

    connections[uuid] = connection;
    //checking if theconnection  is first one....
    if(Object.keys(connections).length == 1){
        wss.send(subscribeRequest);
        console.log("sub to the infura....");
    }
    connection.on('close', () => handleClose(uuid))
})

//Infura webSocket connection....
const wss = new WebSocket('wss://mainnet.infura.io/ws/v3/'+process.env.INFURA_API_KEY);
// WIP:edit this  fucntion acccording to use
const trimData = (data)=>data;
const broadcast = (blockData) => {
    if(Object.keys(connections).length < 1) return;
    Object.keys(connections).forEach(uid=>{
        const connection = connections[uid]
        connection.send(JSON.stringify(blockData));
    })
    console.log("done broadcaseting...");
}

wss.on('open', () => {
    console.log('Connected to Infura WebSocket');
});

wss.on('message', async (data) => {
    const response = await JSON.parse(data);
    if(response?.result){
        currentSub = response.result;
        console.log(currentSub);
        return;
    }
    const blockData = trimData(response);
    console.log(blockData);
    broadcast(blockData)
});

wss.on('close', () => {
    console.log('Disconnected from Infura WebSocket');
});