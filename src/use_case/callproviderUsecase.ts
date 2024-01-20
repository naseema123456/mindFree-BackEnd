import callproviderRepository from "../infrastructure/repository/callproviderRepository"
import TradingRecord from "../domain/trade"
import JWTtoken from "../passwordservice/jwt"
import Appointment from "../domain/appoinment"



class callproviderUsecase{

    private callproviderRepository : callproviderRepository
    private jwtToken: JWTtoken
 

    constructor(callproviderRepository:callproviderRepository){
        this.callproviderRepository = callproviderRepository
        this.jwtToken = new JWTtoken()
      
    }

async register(trade:TradingRecord,token:string|undefined){
    try {
        const claims = this.jwtToken.verifyJWT(token)
        if(!claims) return {
            status: 401,
            success: false,
            message: "Unauthenticated"
    
    
        }
        const id=claims.id
        console.log(id,"idddddddd");
        
        const Newtrade: TradingRecord = {

            usedCapital:trade.usedCapital,
            tradeType:trade.tradeType,
            stockName: trade.stockName,
            date: new Date(), 
            atThePrice: trade. atThePrice,
            quantity: trade.quantity,
            stopLoss:trade.stopLoss,
            target: trade.target,
            userId:id,
            more:trade.more
          
            
         }
         console.log(Newtrade,"Newtrade");
         
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

async loadTrade(){
    try {
        const response = await this.callproviderRepository.loadTrade()
        if (response.success) {
       
    
            // Perform additional actions if needed
    
            return {
              success: true,
              message: 'Successfully retrieved trade',
              data: response.data,
            };
          } else {
            // No users found
            console.error(response.message);
    
            // Perform additional actions if needed
    
            return {
              success: false,
              message: 'Failed to retrieve trade',
            };
          }
    } catch (error) {
        return {
            status: 500,
            success: false,
            message:'An error occurred while retrieving trade'
        }
    }
}
async time(time:string,token:string|undefined){
  try {
    const claims = this.jwtToken.verifyJWT(token)
    if(!claims) return {
        status: 401,
        success: false,
        message: "Unauthenticated"


    }
    const id=claims.id

    const newAppoinment:Appointment={
      callprovider:id,
      time:time,
      status:"pending",
      isBlocked:false,
      amount:1000,
      
    }
    const response = await this.callproviderRepository.time(newAppoinment)
    if (response?.success) {
      return {
          status: 200,
          success: true,
          message: "Appoinment uploaded successfully",
      }
     
    
    } else {
      return{

          status: 400,
          success: false,
          message: response?.message,
    
      }
   
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return{

        status: 500,
        success: false,
        message: "Internal server error",
    }

  }
}
async getappoinment(token:string|undefined){
  try {
    const claims = this.jwtToken.verifyJWT(token)
    const id=claims.id
    const response = await this.callproviderRepository.getappoinment(id)
    if(response.success){
      return response
    }
   
  } catch (error) {
    throw error;
  }
}


async getcallprovider(){
  try {
    const response = await this.callproviderRepository.getcallprovider()
    // console.log(response,"getcallprovider");
    
    return response
  } catch (error) {
    throw error;
  }

}

async getAllappoinment(token:string|undefined){
  try {
    const claims = this.jwtToken.verifyJWT(token)
    const id=claims.id
    const response = await this.callproviderRepository.getAllappoinment(id)
    // console.log(response,"getcallprovider");
    
    return response
  } catch (error) {
    throw error;
  }

}

async getTrade(token:string|undefined){
  try {
    const claims = this.jwtToken.verifyJWT(token)
    const id=claims.id
    const response = await this.callproviderRepository.getTrade(id)
    return response
  } catch (error) {
    throw error;
  }
}

}
export default callproviderUsecase