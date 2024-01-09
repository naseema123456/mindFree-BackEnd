// import mongoose,{Types} from 'mongoose';
import mongoose, { Schema } from "mongoose";
import Appointment from "../../domain/appoinment";

const appointmentSchema: Schema<Appointment> = new mongoose.Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
  
    },
    callprovider: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    date: {
      type: Date,
   
    },
    time: {
      // Adjust the type based on your requirements
      type: String,
      required: true,
    },
    status: {
      // Adjust the type based on your requirements
      type: String,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  });
  

const AppointmentModel = mongoose.model<Appointment>('Appointment', appointmentSchema);
export { AppointmentModel };