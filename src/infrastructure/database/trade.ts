import mongoose, { Document, Schema } from "mongoose";

interface TradingRecord extends Document {
  id?: string;
  date?: Date;
  profitLoss?: number;
  stockName: string;
  tradeType: string;
  exitPrice?: number;
  atThePrice: number;
  quantity: number;
  target: number;
  stopLoss: number;
  percentage?: number;
  usedCapital?: number;
  userId?: string;
  more: string;
}

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
  userId: String,
  more: String,
});

const TradingRecordModel = mongoose.model<TradingRecord>('TradingRecord', tradingRecordSchema);
export { TradingRecordModel };
