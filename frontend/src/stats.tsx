import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type SuccessData = {
    averageBroadcastDelay: number;
    averageDataFetchDelay: number;
    averageIdelTime: number;
    averagelifeTimeOfABlockEmmit: number;
    currentUsers: number;
    lastBroadcastDelay: number;
    lastDataFetchDelay: number;
    lastIdelTime: number;
    numberOfBlockRelayed: number;
} 
type FailData = {
    message: string;
    subTxt?: string;
}

type Data = SuccessData | FailData;

export default function Stats() {
    const [data, setData] = useState<Data>();
    useEffect(() => {
        //fetching the data..
    
        var requestOptions = {
            method: 'GET',
        };
        console.log(import.meta.env.VITE_HTTPS_URL+"/stats");
        fetch(import.meta.env.VITE_HTTPS_URL+"/stats", requestOptions)
            .then(response => {
                switch(response.status){
                    case 200: 
                        return response.text();
                    case 204:
                        return '{message: "Server Not in Testing Mode",subTExt: "add TESTING = true to env"}' as string;
                    default:
                        return '{message: "Error fetching data"}' as string;
                }
            })
            .then(result => JSON.parse(result))
            .then(data => setData(data.data))
            .catch(error => {console.log('error', error);setData({message: "Error fetching data"});});
    },[]);
    console.log(data);
    return (
        <div>
            {data && 'message' in data && (
                <div className="flex items-center justify-center w-full h-screen">
                    <div className="flex items-center justify-center border rounded w-[80%] h-[50%]">
                        <h1 className="text-5xl font-bold text-gray-200">{data.message} !!</h1>
                        {data && 'subTxt' in data && <h1 className="text-2xl font-bold text-gray-500">{data.subTxt}</h1>}
                    </div>
                </div>
            )}
            {data && (
                <div className="flex items-center justify-center w-full h-screen">
                    <div className="flex items-center flex-col justify-center border rounded w-[80%] h-[50%]">
                        <div className="w-full px-3">
                            <Link to="/"><X /></Link>
                        </div>
                        <div>
                            {data && Object.keys(data).map(key => (
                                <h1 className="flex flex-col gap-1">
                                    <span className="text-3xl text-red-400 hover:text-red-500">{key.slice(0,1).toUpperCase() + key.slice(1)}: <span className="text-2xl text-gray-400">{data[key]}</span></span>
                                </h1>
                            )
                            )}
                        </div>
                    </div>
                </div>
            
            )}
        </div>
    );
}