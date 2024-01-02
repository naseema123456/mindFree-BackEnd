import callproviderRepository from "../infrastructure/repository/callproviderRepository"
import TradingRecord from "../domain/trade"


class callproviderUsecase{

    private callproviderRepository : callproviderRepository
 

    constructor(callproviderRepository:callproviderRepository){
        this.callproviderRepository = callproviderRepository
  
      
    }

async register(trade:TradingRecord){
    try {

        const Newtrade: TradingRecord = {
            tradeType:trade.tradeType,
            stockName: trade.stockName,
            atThePrice: trade. atThePrice,
            quantity: trade.quantity,
            stopLoss:trade.stopLoss,
            target: trade.target,
            more:trade.more
          
            
         }
        const response = await this.callproviderRepository.register(Newtrade )
        if (response?.success) {
            return {
                status: 200,
                success: true,
                message: "Profile image uploaded successfully",
            }
           
          
          } else {
            return{

                status: 400,
                success: false,
                message: response?.message,
          
            }
         
          }
        } catch (error) {
          console.error('Error uploading data:', error);
          return{

              status: 500,
              success: false,
              message: "Internal server error",
          }
      
        }
}


}
export default callproviderUsecase