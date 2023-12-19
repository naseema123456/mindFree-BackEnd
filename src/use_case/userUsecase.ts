import User from "../domain/user";
import userRepository from "../infrastructure/repository/userRepository";
import Encrypt from '../passwordservice/hashpassword';
import JWTtoken from '../passwordservice/jwt';
import OtpRepository from "../infrastructure/repository/otpRepository";
import Otp from "../domain/otp";
import mongoose, { Types } from "mongoose";
import { errorMonitor } from "nodemailer/lib/xoauth2";


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

            const userId = response.user?._id?.toString() || '';
            const role = response.user?.role || ''
            const token = this.jwtToken.createJWT(userId, role);
            return {
                status: 200,
                success: true,
                message: response.message + " & " + "otp Sent",
                // user:NewUser,
                token,
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




    
    async verifyOtp( otp:number, id: string): Promise<{ success: boolean, message: string }> {
        try {
         
console.log(otp,id,'............');

            // Check if the provided OTP matches the stored OTP for the user
            const isOtpValid = await this.otpRepository.findOtpByidAndCode(id, otp);;

  
     

            if(isOtpValid.success){            
                    return {
                        success: true,
                        message: 'OTP verified and user updated'
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
                    
                    
                    const userId = storedUser?._id?.toString() || '';
                    const role = storedUser?.role || ''
                    const token = this.jwtToken.createJWT(userId, role);
                    
                    
                 
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










}



export default Userusecase