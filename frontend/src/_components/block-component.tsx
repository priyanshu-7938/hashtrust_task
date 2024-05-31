import { useData } from "../provider/context-provider";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import { BlockData } from "@/constants/types";
import { Loader } from "lucide-react";

export default function BlockComponent() {
    const { blocks, setSelectedBlock } = useData();
    return (
      <>
      <Table className="relative">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Block No.</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Hash</TableHead>
            <TableHead className="text-right">Transactions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="relative w-full">
          {blocks && blocks.map((data:BlockData,index:number) => (
            <>
              <TableRow key={index} className={`cursor-pointer ${index==0?"bg-gray-400":""}`}
                  onClick={() => setSelectedBlock(data)}
              >
                <TableCell className="font-medium">{data.block}</TableCell>
                <TableCell>{data.timestamp}</TableCell>
                <TableCell>{data.blockHash}</TableCell>
                <TableCell className="text-right">{data.transaction.length}</TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
        <div className="font-medium flex justify-center p-3"><Loader className="animate-spin" /> Loading new Blocks</div>
        </>
    )
  }
  