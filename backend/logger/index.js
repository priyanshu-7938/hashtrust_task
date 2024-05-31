// const LogBroadcastDelay (delay) => {}
import fs from 'fs';
import path from 'path';

export default class CustomLogger {
    
    constructor() {
        const __dirname = path.resolve();
        this.filename = __dirname+"\\logger\\log-data.txt";
    }

    logDataFetchDelayDelay(delay) {
        const logEntry = {
            level: 'dataFetchDelay',
            timestamp: new Date().toISOString(),
            delay
        };
        const logLine = JSON.stringify(logEntry);
        fs.appendFileSync(this.filename, logLine + '\n');
    }

    logBroadcastDelay(totalDelay, connections){
        const logEntry = {
            level: 'broadcastDelay',
            timestamp: new Date().toISOString(),
            delay: totalDelay,
            connections: connections
        };
        const logLine = JSON.stringify(logEntry);
        fs.appendFileSync(this.filename, logLine + '\n');
    }
    
    //function for calculating idel time and max users for proper functioning....
    triggerBroadcastComplete(){
        this.lastBroadcastCompelteAt = Date.now();
    }
    triggerBlockArrival(){
        if(this.lastBlockEmitAt != undefined){
            let blockdelay = Date.now() - this.lastBlockEmitAt;
            const logEntry = {
                level: 'blockDelay',
                timestamp: new Date().toISOString(),
                delay: blockdelay
            };
            const logLine = JSON.stringify(logEntry);
            fs.appendFileSync(this.filename, logLine + '\n');
            //loggin the idel time for the node...
            // which is the time required for the block to arrive after the last block was broadcasted...
            let idelTime = Date.now() - this.lastBlockEmitAt;
            const logEntry2 = {
                level: 'socketIdelTime',
                timestamp: new Date().toISOString(),
                delay: idelTime
            };
            const logLine2 = JSON.stringify(logEntry2);
            fs.appendFileSync(this.filename, logLine2 + '\n');
        }
        this.lastBlockEmitAt = Date.now();
    }

    getStats(userCount) {
        const data = this.getLogs();

        const result = {
            numberOfBlockRelayed: 0,
            averageDataFetchDelay: 0,
            lastDataFetchDelay: 0,
            averageBroadcastDelay: 0,
            lastBroadcastDelay: 0,
            currentUsers: userCount,
            averageIdelTime: 0,
            lastIdelTime: 0,   
            averagelifeTimeOfABlockEmmit: 0,       
        }
        
        const socketIdelTime = data.filter((element)=>element.level == 'socketIdelTime');
        const dataFetchDelay = data.filter((element)=>element.level == 'dataFetchDelay');
        const broadcastDelay = data.filter((element)=>element.level == 'broadcastDelay');
        const blockDelay = data.filter((element)=>element.level == 'blockDelay');

        if(socketIdelTime.length > 0){
            result.averageIdelTime = socketIdelTime.reduce((acc,element)=>acc+element.delay,0)/socketIdelTime.length;
            result.lastIdelTime = socketIdelTime[socketIdelTime.length-1].delay;
        }
        if(dataFetchDelay.length > 0){
            result.averageDataFetchDelay = dataFetchDelay.reduce((acc,element)=>acc+element.delay,0)/dataFetchDelay.length;
            result.lastDataFetchDelay = dataFetchDelay[dataFetchDelay.length-1].delay;
        }
        if(broadcastDelay.length > 0){
            result.averageBroadcastDelay = broadcastDelay.reduce((acc,element)=>acc+element.delay,0)/broadcastDelay.length;
            result.lastBroadcastDelay = broadcastDelay[broadcastDelay.length-1].delay;
        }
        if(blockDelay.length > 0){
            result.averagelifeTimeOfABlockEmmit = blockDelay.reduce((acc,element)=>acc+element.delay,0)/blockDelay.length;
            result.numberOfBlockRelayed = blockDelay.length;
        }

        return result;
    }

    getLogs() {
        const fileContent = fs.readFileSync(this.filename, 'utf-8');
        return fileContent.split('\n').filter(line => line).map(line => JSON.parse(line));
    }
}
