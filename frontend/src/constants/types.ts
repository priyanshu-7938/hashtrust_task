export type Transaction = {
    hash: string
    value: number
    from: string
    to: string
}
export type BlockData = {
    block: number
    blockHash: string
    timestamp: number
    transaction: Transaction[]
}