import express from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import url from 'url';
import 'dotenv/config';
import { fetchDesiredData } from "./utils.js"
import cors from 'cors';
import CustomLogger from './logger/index.js';

//creating a linnstance of logger for testing....
const logger = new CustomLogger();
const InTesting = process.env.TESTING == 'true';
if(InTesting)
    console.log("Server is in testing mode...");
//logging only when the server is in testing mode...

const subscribeRequest = JSON.stringify({
    "jsonrpc": "2.0",
    "id": 1,
    "method": "eth_subscribe",
    "params": ["newHeads"]
});

//holds the sub id of current subscription
let currentSub = '';

const app = express();
app.use(cors())

app.get('/',(req,res)=>{
    res.send("hello this is a socket endpoint for the block Fetching!!");
})

app.get('/stats', async (req,res)=>{
    if(!InTesting)
        return res.status(204).send({result: "Server is not in testing mode."});
    //get the stats from the logger...
    const data = logger.getStats(Object.keys(connections).length);
    return res.status(200).send({data});
    
})

const server = app.listen(3002, () => {
    console.log('Server is running on port 3002');
});

const socket = new WebSocketServer({ server });

//maintain the connections....
const connections = {}

const handleClose = (uid)=>{
    delete connections[uid];
    //if everyone is dissconected then unsubscribe to infura...
    if(Object.keys(connections).length == 0){
        // unsubscribing to the infura...
        wss.send( `{
                "jsonrpc": "2.0",
                "id": 1,
                "method": "eth_unsubscribe",
                "params": ["${currentSub}"]
            }`);
        console.log("Unsubscribed to infura:");
    }
}

socket.on('connection',(connection, request)=>{
    
    // console.log(request);
    const { uuid } = url.parse(request.url,true).query;
    console.log("user_connected: ",uuid);

    connections[uuid] = connection;
    //checking if theconnection  is first one....
    if(Object.keys(connections).length == 1){
        wss.send(subscribeRequest);
        console.log("sub to the infura:");
    }
    //handle closing of a connection....
    connection.on('close', () => handleClose(uuid))
})

//function to broadcast the block data
const broadcast = (blockData) => {
    const START_broadcastingTime = Date.now();
    if(Object.keys(connections).length < 1) return;
    Object.keys(connections).forEach(uid=>{
        const connection = connections[uid]
        connection.send(JSON.stringify(blockData));
    })
    const broadcastingTime = Date.now() - START_broadcastingTime;
    if(InTesting){
        logger.logBroadcastDelay(broadcastingTime,Object.keys(connections).length);
        logger.triggerBroadcastComplete();
    }
    console.log("Broadcaseted latest block...");
}

//Infura webSocket connection estabilished....
const wss = new WebSocket('wss://mainnet.infura.io/ws/v3/'+process.env.INFURA_API_KEY);


//log when the infura webSocket cnnects...
wss.on('open', () => {
    console.log('Connected to Infura WebSocket');
});

//relay the blockData
wss.on('message', async (data) => {
    // calculating the delayed time
    const START_delayInBroadcastAfterTrigger = Date.now();

    if(InTesting)
        logger.triggerBlockArrival();//saving to calculate idel time...

    const response = await JSON.parse(data);
    if(response?.result){
        currentSub = response.result;
        console.log("sub_id: ",currentSub);
        return;
    }
    const desiredData = await fetchDesiredData(response);

    const delayInBroadcastAfterTrigger = Date.now() - START_delayInBroadcastAfterTrigger;
    if(InTesting)
        logger.logDataFetchDelayDelay(delayInBroadcastAfterTrigger);
    
    broadcast(desiredData)
});

//log when infura web socket disconnects.....
wss.on('close', () => {
    console.log('Disconnected from Infura WebSocket');
});