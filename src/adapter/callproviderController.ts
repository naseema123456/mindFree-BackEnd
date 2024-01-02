import { Request,Response } from "express";
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

    const response = await this.callprovidercase.register(req.body)
    
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

}

export default callproviderController