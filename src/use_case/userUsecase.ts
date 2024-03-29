import User from "../domain/user";
import userRepository from "../infrastructure/repository/userRepository";
import Encrypt from '../passwordservice/hashpassword';
import JWTtoken from '../passwordservice/jwt';
import OtpRepository from "../infrastructure/repository/otpRepository";
import Otp from "../domain/otp";
import mongoose, { Types } from "mongoose";

import ChatModel, { Chat } from "../infrastructure/database/chat";
import { IApimsg } from "../infrastructure/database/notification";


class Userusecase{
    private userRepository : userRepository
    private otpRepository: OtpRepository
    private encrypt: Encrypt
    private jwtToken: JWTtoken
    constructor(userRepository:userRepository){
        this.userRepository = userRepository
        this.otpRepository = new OtpRepository
        this.encrypt = new Encrypt()
        this.jwtToken = new JWTtoken()
    }

    async register(user:User, otp: number){
        console.log('inside useCase')
        const newPassword = await this.encrypt.createHash(user.password);
        const NewUser: User = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
         
            password: newPassword,
            phoneNumber: user.phoneNumber,
            role: 'user', 
            isBlocked: false, 
            isVerified: false, 
            
         }
        const response = await this.userRepository.create(NewUser)

        if (!response.success) {
            return {
                status: 500,
                success: false,
                message: response.message,
                // user:response.user
            }
        }

        let otpDetails: Otp = {
           
            id: response.user?._id , 
            otp,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            createdAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }



        const saveOtp = await this.otpRepository.SaveOtp(otpDetails)



        if (saveOtp?.success) {

            
            return {
                status: 200,
                success: true,
                message: response.message + " & " + "otp Sent",
                // user:NewUser,
              
                user: response?.user,
                email: response.user?.email,
                id: response.user?._id
            }

        }

    } catch (error: Error) {
        return {
            status: 500,
            success: false,
            message: "server error"

        }
    }




    
    async verifyOtp( otp:number, id: string): Promise<{ success: boolean, message: string ,}> {
        try {
         
console.log(otp,id,'............');

            // Check if the provided OTP matches the stored OTP for the user
            const isOtpValid = await this.otpRepository.findOtpByidAndCode(id, otp);;

  
     console.log(isOtpValid,'..........');
     

            if(isOtpValid.success){      
    
                    return {
                        success: true,
                        message: 'OTP verified and user updated',
                   
                        
                    };
                } else {
                    return {
                        success: false,
                        message: 'User not found or not updated'
                    };
                }
          
        } catch (error) {
            console.error('Error verifying OTP in UserUseCase:', error);
            return {
                success: false,
                message: 'Error occurred while OTP verification'
            };
        }
    }



    async login(credentials:{email: string, password: string}){

        try {

            const { email, password } = credentials
            
            
            const response = await this.userRepository.findByEmail(email)
           
            
            if (response.success) {
                const storedUser = response.user;
                
                if (storedUser && storedUser.password) {
                    const passwordMatch = await this.encrypt.compare(password, storedUser.password);
                    
                    if (!passwordMatch) {
                        // Incorrect password
                        return {
                            status: 401,
                            success: false,
                            message: "Invalid credentials",
                        };
                    }
                    
                    console.log("before");
                    const userId = storedUser?._id?.toString() || '';
                    const role = storedUser?.role || ''
                    const token = this.jwtToken.createJWT(userId, role);
                    console.log("after");
                   
                    // const accessToken = this.jwtToken.generateAccessToken(userId.role)
                    // const refreshToken = this.jwt.generateRefreshToken(userData._id)
                    // Password is correct then // checking is blocked or not
                    
                    if (storedUser?.isBlocked) {
                        return {
                            message: 'admin blocked',
                            user: storedUser,
                        }
                    }
                    
                  
                    
                    if (storedUser?.isVerified == false) {
                
                        return {
                            message: 'You are not verified.After 24 hour you can register again ',
                            user: storedUser,
                        }

                    }

                    
                    return {
                        status: 200,
                        token,
                        user: storedUser,
                        success: true,
                        message: "Login successful",
                    }

                } else {
                    // User or password not found
                    return {
                        status: 401,
                        success: false,
                        message: "Invalid credentials",

                    };
                }
            } else {

                return {
                    status: 400,
                    success: false,
                    message: response.message,
                };
            }
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: "Internal server error. Please try again later.",
            }
        }


    }



    async resendotp(id:string, otp: number){
        try {
            let objectId: mongoose.Types.ObjectId;

    if (typeof id === 'string') {
      // If id is a string, create ObjectId from the string
      objectId = mongoose.Types.ObjectId.createFromHexString(id);
    } else {
      objectId = id;
    }
    console.log(objectId, otp);
            let otpDetails: Otp = {
           
                id: objectId , 
                otp,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
                createdAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
    
    
        
            const saveOtp = await this.otpRepository.SaveOtp(otpDetails)
    
       console.log(saveOtp,'usecase,saveotp......');
       
            if (saveOtp?.success) {

            
                return {
                    status: 200,
                    success: true,
                    message: "otp Sent",
                   
                    id:id
                }
    
            }
        
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: "server error"
    
            }
    }
        



    }
    async resetpassword(password:string,id:string){
try {
    const newPassword = await this.encrypt.createHash(password);
    const response = await this.userRepository.resetpassword(newPassword,id)
    
    if (response.success) {
        return {
          status: 200,
          success: true,
          message: 'Password reset successful',
        };
      } else {
        return {
          status: 400, // or appropriate HTTP status code
          success: false,
          message: response.message,
        };
      }
} catch (error) {
    return {
        status: 500,
        success: false,
        message: "server error"

    }
}
}
   async profile(token:string|undefined){
try {
    console.log("use profile");
    
    const claims = this.jwtToken.verifyJWT(token)

    
    if(!claims) return {
        status: 401,
        success: false,
        message: "Unauthenticated"


    }
    const id=claims.id
    const response = await this.userRepository.profile(id )
   
    return {
        status: 200, // Change the status code based on your use case
        success: true,
        data: response,
      };
    
} catch (error) {
    return {
        status: 500,
        success: false,
        message: "server error"

    }
}
   }

async appoinment(callProvider:string,token:string|undefined,time:string){
    try {
     
        const claims = this.jwtToken.verifyJWT(token)

    
        if(!claims) return {
            status: 401,
            success: false,
            message: "Unauthenticated"
    
    
        }
        const id=claims.id
     
        const date = new Date();
      
        const response = await this.userRepository.appoinment(callProvider,id,time,date )
        if (response.success) {
            return {
                status: 200, // Change the status code based on your use case
                success: true,
                data: response,
              };
          }
    } catch (error) {
          return {
        status: 500,
        success: false,
        message: "server error"

    }
    }
}

async getTime(id:string|undefined){
    try {
        const response = await this.userRepository.getTime(id)
        if(response){
            return {
                status: 200,
                data: response.data,
                success: true,
                message: response.message,
            }
    
        }else {
        // User or password not found
        return {
            status: 401,
            success: false,
            message: "Invalid credentials",

        };
    }

} catch (error) {
return {
    status: 500,
    success: false,
    message: "Internal server error. Please try again later.",
}
}
}

 async sendMessage(data: any): Promise<any> {
    // Your implementation here
    console.log(data);

    try {
        console.log("Inside send message");
        const senderId = data.sender;
        const receiverId = data.receiver;
        const message=data.messages
      
        // Find the chat conversation where both senderId and receiverId are members
        const existingChat = await ChatModel.findOne({
          member: {
            $all: [senderId, receiverId],
          },
        });
      
        if (existingChat) {
          // If the conversation exists, push the new message
          existingChat.messages.push({
            text: data.messages,
            sender: senderId,
          });
      
          // Save the updated conversation
          await existingChat.save();
          return existingChat
        } else {
          // If the conversation doesn't exist, create a new one
          const newChat = new ChatModel({
            member: [senderId, receiverId],
            messages: [
              {
                text: data.messages,
                sender: senderId,
              },
            ],
          });
      
          // Save the new conversation
          await newChat.save();
          return newChat
        }
      
      } catch (error) {
        console.error("Error sending message:", error);
      }
};

async gethistory(userId:string,receiverId:string) {
try {
    const response = await this.userRepository.gethistory(userId,receiverId)
    return response
} catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
}

}

async getvideo(id:string,time:string){
    try {
        const response = await this.userRepository.getvideo(id,time)
        return response
    } catch (error) {
        console.error('Error fetching chat history:', error);
        throw error;
    }
}
async video(id:string){
    try {
        const response = await this.userRepository.video(id)
        return response
    } catch (error) {
        console.error('Error fetching chat history:', error);
        throw error;
    }
}
async contact(subject:string,message:string,token:string|undefined){
    try {
        const claims = this.jwtToken.verifyJWT(token)
        if(!claims) return {
            status: 401,
            success: false,
            message: "Unauthenticated"
        }
        const id=claims.id
        const NewAppointment: IApimsg = {
            sender:id,
            date:new Date(), 
            messages:{
                subject:subject,
                message:message
            }       
         }
        const response = await this.userRepository.contact(NewAppointment)
        return response
    } catch (error) {
        console.error('Error fetching chat history:', error);
        throw error;
    }
}

}



export default Userusecase