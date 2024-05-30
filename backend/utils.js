import 'dotenv/config';
import axios from 'axios';

export const fetchDesiredData = async(latestBlockHeader)=>{
  //fetching the block from the infura...
  var rpcData = JSON.stringify({"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":[latestBlockHeader.params.result.number,true],"id":1});
  
  var config = {
    method: 'post',
    url: 'https://mainnet.infura.io/v3/'+process.env.INFURA_API_KEY,
    headers: { 
      'Content-Type': 'application/json'
    },
    data : rpcData
  };   
  const { data: blockData } = await axios(config);
  //custom function to extract the desired info...
  return conciseData(blockData);
};

const conciseData = (blockData)=>{
  const finalData = {
    block: parseInt(blockData.result.number, 16),
    blockHash: (blockData.result.hash),
    timestamp: parseInt(blockData.result.timestamp, 16),
  }
  finalData.transaction = blockData.result.transactions.map( txn => {
    return {
      hash: txn.hash,
      value: parseInt(txn.value, 16),
      from: txn.from,
      to: txn.to
    }
  })
  return finalData;
}
