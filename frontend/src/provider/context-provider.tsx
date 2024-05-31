import React, { createContext, useState, ReactNode, useEffect } from "react";
import { BlockData } from "@/constants/types";
import { v4 } from 'uuid';
interface DataContextType {
  blocks: BlockData[] | undefined;
  setBlocks: React.Dispatch<React.SetStateAction<BlockData[]>>;
  selectedBlock: BlockData | undefined;
  setSelectedBlock: React.Dispatch<React.SetStateAction<BlockData | undefined>>;
  userUid: string ;
}

const MyData = createContext<DataContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export default function DataProvider({ children }: Props) {
    const [ blocks, setBlocks] = useState<BlockData[]>([]);
    const [ selectedBlock, setSelectedBlock ] = useState<BlockData>();
    const [ userUid, setUserUid ] = useState<string>(v4());

    return (
        <MyData.Provider value={{ 
            blocks, 
            setBlocks,
            userUid,
            selectedBlock, 
            setSelectedBlock
        }}>
        {children}
        </MyData.Provider>
    );
}

export const useData = () => {
  const context = React.useContext(MyData);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
