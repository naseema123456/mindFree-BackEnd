import mongoose, { Document, Schema } from "mongoose";
import TradingRecord from "../../domain/trade";



const tradingRecordSchema: Schema<TradingRecord> = new mongoose.Schema({
  date: Date,
  profitLoss: Number,
  stockName: String,
  tradeType: String,
  exitPrice: Number,
  atThePrice: Number,
  quantity: Number,
  target: Number,
  stopLoss: Number,
  percentage: Number,
  usedCapital: Number,
  userId:{
    type:mongoose.Types.ObjectId,
    ref:'user'
  },
  more: String,
});

const TradingRecordModel = mongoose.model<TradingRecord>('TradingRecord', tradingRecordSchema);
export { TradingRecordModel };
