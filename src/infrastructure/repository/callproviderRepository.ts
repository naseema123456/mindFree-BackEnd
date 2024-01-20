import TradingRecord from "../../domain/trade"
import { TradingRecordModel } from "../database/trade"; 
import { UserModel } from '../database/userModel';
import { AppointmentModel } from "../database/appoinment";
import Appointment from "../../domain/appoinment";
import { ObjectId } from 'mongodb';
class callproviderRepository{


    async register(trade:TradingRecord){
        try {
            // console.log(trade,"trade");
            
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
            
        
            // console.log(Trade);
          
            
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
      }
    
    
    
    async getappoinment(id:string|undefined){
      try {
        const Appoinment = await AppointmentModel.find({callprovider:id})
        if (Appoinment && Appoinment.length > 0) {
       
          return {
            success: true,
            message: 'Appoinment found',
            data: Appoinment, // Optionally return the users data if needed
          };
        } else {
          console.log('Appoinment not found');
          return {
            success: false,
            message: 'No Appoinment found',
          };
        }


      } catch (error) {
        return {
          success: false,
          message: "database error",
        };
  }

}

async getcallprovider(){
  try {
    const appointments = await AppointmentModel.find().populate({
      path: 'callprovider',
      select: 'firstName lastName',
    });
    
    // Use a Set to keep track of unique callprovider IDs
    const uniqueCallProviders = new Set();
    
    // Filter out duplicates and create an array of distinct callproviders
    const distinctTradeProviders = appointments.filter(appointment => {
      const callproviderId = appointment.callprovider.toString();
      if (!uniqueCallProviders.has(callproviderId)) {
        uniqueCallProviders.add(callproviderId);
        return true;
      }
      return false;
    });
    
   
    return distinctTradeProviders
    

  } catch (error) {
    return {
      success: false,
      message: "database error",
    };
  }

}


async getAllappoinment(id: string | undefined) {
  try {
    const Appoinment = await AppointmentModel.find({
      $or: [
        { callprovider: id },
        { userId: id },
      ],
    });
    // console.log(Appoinment, "aaaaaaaaaaaa");

    let appointments; // Declare the variable outside of the if blocks

    if (Appoinment) {
      const idToCheck = new ObjectId(id).toString();
      const isMatchingId = Appoinment.some((item) => {
        const callproviderId = item.callprovider?.toString(); // Convert ObjectId to string
        return callproviderId === idToCheck;
      });

      if (isMatchingId) {
        appointments = await AppointmentModel.find({ callprovider: idToCheck }).populate({
          path: 'userId',
          select: 'firstName lastName',
        });
      } else {
        appointments = await AppointmentModel.find({ userId: idToCheck }).populate({
          path: 'callprovider',
          select: 'firstName lastName',
        });
        // console.log(appointments, "appointments");
      }
    }

    if (Appoinment && appointments && appointments.length > 0) {
      return {
        success: true,
        message: 'Appoinment found',
        data: appointments
      };
    } else {
      console.log('Appoinment not found');
      return {
        success: false,
        message: 'No Appoinment found',
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error fetching appointments',
    };
  }
}


async getTrade(id:string|undefined){
  try {
    const trade = await TradingRecordModel.find({
      userId: {
        $eq: id
      }
    });
    console.log(trade,"trade");
    return trade
    
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error fetching appointments',
    };
  }
}
    
    }


export default callproviderRepository