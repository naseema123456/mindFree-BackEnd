import mongoose, { Schema, Document } from "mongoose";

interface Appointment  {
  userId?: typeof Schema.Types.ObjectId;
  callprovider: typeof Schema.Types.ObjectId;
  date?: Date;
  time: string;
  status: string;
  amount:number;
  isBlocked: boolean;
}

export default Appointment;
