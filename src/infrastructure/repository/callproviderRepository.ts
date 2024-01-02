import TradingRecord from "../../domain/trade"
import { TradingRecordModel } from "../database/trade"; 

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
}

export default callproviderRepository