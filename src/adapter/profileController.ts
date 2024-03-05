import { Request,Response } from "express";

import profileUsecase from "../use_case/profileUsecase";
import profileRepository from "../infrastructure/repository/profileRepository";





class profileController{
    private profilecase:profileUsecase
    private profileRepository:profileRepository

    constructor(profilecase:profileUsecase){
        this.profilecase = profilecase
        this.profileRepository =new profileRepository;
    }

    async upload(req: Request, res: Response){
        console.log('upload controller');
        try {
            // console.log( req.file?.filename);
            const file= req.file?.filename
            const token=req.headers.authorization
          
            const response = await this.profilecase.upload(file,token)
        
            if (response.success) {
                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Profile image uploaded successfully",
                });
            } else {
                return res.status(response.status).json({
                    status: response.status,
                    success: false,
                    message: response.message,
                });
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal server error",
            });
        }
 
    }


    async update(req: Request, res: Response){
try {
    
    // console.log(req.body,".........");
  
    const response = await this.profilecase.update(req.body)
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
    console.error('Error uploading file:', error);
    return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
    });
}
    }

}

export default profileController