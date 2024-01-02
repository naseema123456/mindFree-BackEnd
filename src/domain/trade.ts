interface TradingRecord {
    id?: string;
    date?: Date; // Use the appropriate date type based on your data structure
    profitLoss?: number; // Assuming this can be a decimal value
    stockName: string;
    tradeType: string; // You might want to use an enum or a more specific type
    exitPrice?: number;
    atThePrice: number;
    quantity: number;
    target: number;
    stopLoss: number;
    percentage?: number;
    usedCapital?: number;
    userId?: string;
    more:string;
  }
  
  export default TradingRecord;
  