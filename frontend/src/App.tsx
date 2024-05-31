import { useEffect, useState } from 'react'
import './App.css'
import { useData } from './provider/context-provider'
import useWebSocket from 'react-use-websocket';
import BlockComponent from './_components/block-component';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable"
import Transactions from './_components/transactions';


function App() {
  const {blocks, setBlocks, userUid: uuid, selectedBlock, setSelectedBlock } = useData();
  const { listening, setListening } = useState<boolean>(false);
  
  const { lastMessage, readyState } = useWebSocket(import.meta.env.VITE_WS_URL, {
    queryParams: { uuid }
  })

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(JSON.parse(lastMessage.data));
      setBlocks(prevBlocks => [ JSON.parse(lastMessage.data), ...(prevBlocks || [])]);
    }
  }, [lastMessage]);
  
  return (
    <div>
      <div className="px-5">
        <h1 className="text-2xl font-bold">eth_getBlockByNumber</h1>

      </div>
      <div className="m-[20px] ">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-w-[200px] rounded-lg border relative"
          >
          <ResizablePanel>
            <div className="h-[89vh] justify-center overflow-y-auto">
              <BlockComponent />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          { selectedBlock && (
            <ResizablePanel defaultSize={40}>
              <div className="h-[89vh] justify-center overflow-y-auto">
                <Transactions />
              </div>
            </ResizablePanel>
            ) 
          }
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default App
