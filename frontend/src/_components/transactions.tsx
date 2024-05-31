import { useData } from "../provider/context-provider";
import { Blocks, X } from "lucide-react";
import { useCallback } from "react";

export default function Transactions() {
    const { selectedBlock, setSelectedBlock, blocks } = useData();
    // const [ sort, setSort ] = useState<"acending" | "decending" | "unsorted">("unsorted");

    const totalAmount = useCallback(()=>{
        let total = 0;
        if(selectedBlock === undefined) return total;
        selectedBlock.transaction.map((transaction)=>{
            total+=transaction.value/1e18;
        })
        return total;
    },[selectedBlock])
    
    const isLatestBlock = useCallback(()=>{
        if(selectedBlock == undefined || blocks == undefined) return false;
        console.log(selectedBlock, blocks[0])
        return selectedBlock.block == blocks[0].block;
    },[blocks, selectedBlock]);
    console.log(totalAmount());
    console.log(selectedBlock);
    return (
        <div className="p-4 pt-[45px] relative">
            <div className="flex justify-between items-center absolute top-0 bg-background w-[97%] h-[50px]">
                <div className="font-medium flex items-center gap-2">
                    <Blocks />
                    <span className="pt-1">{selectedBlock && selectedBlock.block}</span>
                    <span className="text-xs text-red-500">{isLatestBlock() && "Latest!!"}</span>
                </div>
                
                <X onClick={()=>{
                    setSelectedBlock(undefined);
                }} />
            </div>
            <div className="flex flex-col gap-2 justify-end">
                <div className="font-medium text-3xl text-end text-red-500">Total Amount: {Math.round(totalAmount()*10000)/10000}ETH</div>
                <div className="font-medium text-3xl text-end text-red-500">Total Transactions: {selectedBlock && selectedBlock.transaction.length}</div>

            </div>
            <div className="">
                <div className="flex justify-between p-2 border-b border-gray-600">
                    <div className="font-medium text-red-500">Transaction hash</div>
                    <div className="text-red-500">Value ETH</div>
                </div>
                {selectedBlock && selectedBlock.transaction.map((transaction, index) => {
                    return (
                        <div key={index} className="flex justify-between p-2 border-b border-gray-600">
                            <div className="font-medium">{transaction.hash.slice(0,6)+"......"+transaction.hash.slice(-7)}</div>
                            <div>{transaction.value/1e18}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}