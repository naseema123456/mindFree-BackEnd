import { Request,Response } from "express";
import Adminusecase from "../use_case/adminUsecase";
import AdminRepository from "../infrastructure/repository/adminRepository";

import OtpRepository from "../infrastructure/repository/otpRepository";




class adminController{
    private admincase:Adminusecase
    private adminRepository:AdminRepository
    private otpRepository:OtpRepository


    constructor(admincase:Adminusecase){
        this.admincase = admincase
        this.adminRepository =new AdminRepository;
  
        this.otpRepository= new OtpRepository
    }

    
    // Validation function for email using regex
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

   // Validation function for phone number using regex and minimum length
   private isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\d{10}$/; // Adjust the regex based on your requirements
    return phoneRegex.test(phone);
}

    // Validation function for password minimum length
    private isValidPassword(password: string): boolean {
        return password.length >= 6; // Adjust the minimum length based on your requirements
    }


    // Validation function for isBlocked
private isValidIsBlocked(isBlocked: boolean): boolean {
    // Assuming isBlocked can be either 'true' or 'false'
    return isBlocked === true || isBlocked === false;
}

// Validation function for role
private isValidRole(role: string): boolean {
    const validRoles = ['user', 'admin','callprovider'];
    return validRoles.includes(role.toLowerCase());
}

    async login(req: Request, res: Response) {
        try {
            let {  email, password } = req.body

           

            
            // Validate email
            if (!this.isValidEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format",
                });
            }

                // Validate password
                if (!this.isValidPassword(password)) {
                    return res.status(400).json({
                        success: false,
                        message: "Password must be at least 6 characters long",
                    });
                }

                const user = await this.admincase.login({ email , password})
          
            
console.log(user,'.......admin controller.....');

                if (!user) {
                    res.status(400).json({ message: 'Invalid credentials' });
                    return
                }
    
    
                if (!user.success) {
                    console.log(user.message)
                    return res.status(400).json({
                        message: user.message
                    })
                }
    
        
    
                console.log(user.message,"msg")
    
                res.status(200).json({
                    success: true,
                    message: "login successful",
                    user:user?.user,
                    isVerified:true,
                    token:user?.token
                });
    
    
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    success: 'false', message: 'error occured try again'
                })
            }
        }
    
    


        async Users(req: Request, res: Response) {
            try {
              console.log('admin Controller....');
              
                const users = await this.admincase.Users()
            
                if (users.success) {
                    return res.status(200).json({
                      success: true,
                      message: 'Users retrieved successfully',
                      data: users.data,
                    });
                  } else {
                    return res.status(500).json({
                      success: false,
                      message: 'Failed to retrieve users',
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
       


        async addUser(req: Request, res: Response) {
            try {
            
                let { firstName,lastName, email, password, phoneNumber } = req.body


                // Validate email
                if (!this.isValidEmail(email)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid email format",
                    });
                }
    
                // Validate phone number
                if (!this.isValidPhoneNumber(phoneNumber)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid phone number",
                    });
                }
    
                // Validate password
                if (!this.isValidPassword(password)) {
                    return res.status(400).json({
                        success: false,
                        message: "Password must be at least 6 characters long",
                    });
                }

                const existResponse = await this.adminRepository.findByEmail(email);
                if (existResponse.success) {

                    return res.status(400).json({
                        success: false,
                        message: "User already exists",
                    });
                }
                const response = await this.admincase.addUser(req.body)
          
      
            

                if (!response?.success) {
                    return res.status(500).json(response)
                }
    
    
                res.status(response.status).json(response)
    
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: "server error"
                })
            }
        }

        async getUser(req: Request, res: Response) {
            try {
                console.log(req.params);
              
                const user = await this.admincase.getUser(req.params.user_id)
                if (user) {
                    // Send the user data as a response
                    return res.status(200).json(user);
                  } else {
                    // Handle the case where the user is not found
                    return res.status(404).json({ message: 'User not found' });
                  }
                
                
            } catch (error) {
                console.error('Error fetching user:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }

        async editUser(req: Request, res: Response){
            try {
                console.log(req.body);
                // let {isBlocked, role } = req.body

          
             const role =req.body.role
             const id=req.body.userId
                
               
    
                    // Validate role
                    if (!this.isValidRole(role)) {
                        return res.status(400).json({
                            success: false,
                            message: "role should be 'user', 'admin', 'callProvider'",
                        });
                    }
              
                    const user = await this.admincase.editUser(role,id)
              
                
    console.log(user,'.......admin controller.....');
                
    if (user.success) {
        // The update was successful
        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
        });
    } else {
        // The update failed
        return res.status(404).json({
            success: false,
            message: 'User not found or not updated',
        });
    }
} catch (error) {
    console.error(error);
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
}


        }

async Bloked(req: Request, res: Response){
    try {
console.log(req.body);

const isBlocked=req.body.isBlocked
const id=req.body._id

    console.log(isBlocked,id)
  

        const response = await this.admincase.Bloked(isBlocked ,id)
    console.log(response,'..........');
    
        if (response && response.success) {
            console.log('User updated successfully');
            return res.status(200).json({
                success: true,
                message: 'User updated successfully',
            });
        } else {
            console.log('User not found or not updated');
// The update failed
return res.status(404).json({
    success: false,
    message: 'User not found or not updated',
});
        }
    }  catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

async getMarket(req: Request, res: Response){
    try {
        const market = await this.admincase.getMarket()
        return res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: market,
          });
    } catch (error) {
           console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
    }
    async getMessages(req: Request, res: Response){
        try {
            const message = await this.admincase.getMessages()
            return res.status(200).json({
                success: true,
                message: 'Users retrieved successfully',
                data: message,
              });
        } catch (error) {
               console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
        }
}



export default adminController

