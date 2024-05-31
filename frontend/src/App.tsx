import { useEffect } from 'react'
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
import { Link2, ReplaceIcon } from 'lucide-react';
import { Link } from 'react-router-dom';


function App() {
  const { setBlocks, userUid: uuid, selectedBlock } = useData();
  // const { listening, setListening } = useState<boolean>(false);
  
  const { lastMessage } = useWebSocket(import.meta.env.VITE_WS_URL, {
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
      <div className="px-5 mt-[10px] flex gap-3 items-end">
        <div className="text-red-400 mb-[3px]">
          <ReplaceIcon/>
        </div>
        <h1 className="text-4xl font-bold flex items-end">Relay<span className="text-xl text-red-400 hover:text-red-500"><Link to="/stats" className="flex gap-1 items-center">/stats<Link2/> </Link></span></h1>

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
