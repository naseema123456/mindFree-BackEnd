import { Request,Response, response } from "express";
import callproviderUsecase from "../use_case/callproviderUsecase";
import callproviderRepository from "../infrastructure/repository/callproviderRepository";



class callproviderController{
    private callprovidercase:callproviderUsecase
    private callproviderRepository:callproviderRepository



    constructor(callprovidercase:callproviderUsecase){
        this.callprovidercase = callprovidercase
        this.callproviderRepository =new callproviderRepository;
 
    }


    async register(req: Request, res: Response) {
try {
    
    const token=req.headers.authorization
    // console.log(token);
    // console.log(req.body);
    
    const response = await this.callprovidercase.register(req.body,token)
    
    if (response.success) {
        return res.status(200).json({
            status: 200,
            success: true,
            message: response.message,
        });
    } else {
        return res.status(response.status).json({
            status: response.status,
            success: false,
            message: response.message,
        });
    }
} catch (error) {
  
    return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
    });
}
    }

    async loadTrade(req: Request, res: Response){
try {
    
    const trade = await this.callprovidercase.loadTrade()
            
    if (trade.success) {
        return res.status(200).json({
          success: true,
          message: 'trade retrieved successfully',
          data: trade.data,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Failed to retrieve trade',
        });
      }
    
} catch (error) {
    {
        console.error('An unexpected error occurred:', error);
        return res.status(500).json({
          success: false,
          message: 'An unexpected error occurred',
        
        });
      }
}
    }


    async time(req: Request, res: Response){
// console.log(req.body.time);
try{
const token=req.headers.authorization
const response = await this.callprovidercase.time(req.body.time,token)
// console.log(response,"response time,controller");

if (response.success) {
    res.status(200).json({
      success: true,
      message: response.message,
    });
  } else {
    res.status(400).json({
      success: false,
      message: response.message,
    });
  }
} catch (error) {
console.error(error);
res.status(500).json({
    success: false,
    message: "server error"
})
}
    }

    async getappoinment(req: Request, res: Response){
      try {
        // console.log("getappoinment");
        const token=req.headers.authorization    
        const response = await this.callprovidercase.getappoinment(token)
        // console.log(response,"response in getappoinment controller");
        if (response) {
          return res.status(200).json({
            success: true,
            message: 'Appoinment retrieved successfully',
            data: response.data,
          });
        } else {
          return res.status(500).json({
            success: false,
            message: 'Failed to retrieve appoinment',
          });
        }
      
  } catch (error) {
      {
          console.error('An unexpected error occurred:', error);
          return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred',
          
          });
        }
  }
}
async getcallprovider(req: Request, res: Response){
  try {
    // console.log("hiiii");
    const response = await this.callprovidercase.getcallprovider()
    // console.log(response, "getcallprovider");
    
    if(response){
      // Return response
      return res.json({
        Message: "got it",
        success: true,
        data: response
      });
    }

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred'
    });
  }
}

async getAllappoinment(req: Request, res: Response){
  const token=req.headers.authorization  
  const response = await this.callprovidercase.getAllappoinment(token)
  // console.log(response,"res");
  
  if (response) {
    return res.status(200).json({
      success: true,
      message: 'Appoinment retrieved successfully',
      data: response.data,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve appoinment',
    });
  }

} catch (error:Error) {
{
    console.error('An unexpected error occurred:', error);
    return response.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    
    });
  }
}

async getTrade(req: Request, res: Response){
try {
  const token=req.headers.authorization  
  const response = await this.callprovidercase.getTrade(token)
  return res.status(200).json({
    success: true,
    message: 'All trade retrieved successfully',
    data: response,
  });
  
} catch (error) {
  console.error('An unexpected error occurred:', error);
  return response.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
  
  });
}
  
}

}




export default callproviderController