import TradingRecord from "../../domain/trade"
import { TradingRecordModel } from "../database/trade"; 
import { UserModel } from '../database/userModel';
import { AppointmentModel } from "../database/appoinment";
import Appointment from "../../domain/appoinment";
class callproviderRepository{


    async register(trade:TradingRecord){
        try {
            console.log(trade,"trade");
            
            const response = await new TradingRecordModel(trade).save();
          
            return {
                success: true,
                message: "Trading record saved successfully created",
                user:response

            }
        } catch (error) {
            return {
                 success : false,
                 message: " Error saving trading record"
            }
        }
    }


    async loadTrade(){
        try {
            // const Trade = await TradingRecordModel.find()
            const Trade = await TradingRecordModel.find().populate({
              path: 'userId',
              select: 'firstName lastName', 
            });
            
        
            console.log(Trade);
          
            
            if (Trade && Trade.length > 0) {
       
              return {
                success: true,
                message: 'Trade found',
                data: Trade, // Optionally return the users data if needed
              };
            } else {
              console.log('Trade not found');
              return {
                success: false,
                message: 'No Trade found',
              };
            }


          } catch (error) {
            return {
              success: false,
              message: "database error",
            };
      }
    }

    async time(newAppoinment:Appointment){

      try {
  const response = await new AppointmentModel(newAppoinment).save();

  return {
    success: true,
    message: "appoinment created",
    user:response

}
} catch (error) {
return {
     success : false,
     message: "database error"
}
}
      }}


export default callproviderRepository