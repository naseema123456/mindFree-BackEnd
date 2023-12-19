import { Request,Response } from "express";
import Userusecase from "../use_case/userUsecase";
import UserRepository from "../infrastructure/repository/userRepository";
import {UserModel} from "../infrastructure/database/userModel";
import GenerateOtp from "../infrastructure/utility/generateotp";
import SendMail from "../infrastructure/utility/sendmail";
import OtpRepository from "../infrastructure/repository/otpRepository";
import Otp from "../domain/otp"



class userController{
    private usercase:Userusecase
    private userRepository:UserRepository
    private generateOtp: GenerateOtp
    private sendMail: SendMail
    private otpRepository:OtpRepository


    constructor(usercase:Userusecase){
        this.usercase = usercase
        this.userRepository =new UserRepository;
        this.generateOtp = new GenerateOtp()
        this.sendMail = new SendMail()
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

    async register(req: Request, res: Response) {
        try {
            let { firstName,lastName, email, password, phoneNumber } = req.body

            firstName = firstName.trim();
            lastName = lastName.trim();
            email = email.trim();
            password = password.trim();
            phoneNumber = phoneNumber.trim();

            if (!firstName ||!lastName || !email || !password || !phoneNumber) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                });
            }

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

            const existResponse = await this.userRepository.findByEmail(email);

            if (existResponse.success) {

               

                return res.status(400).json({
                    success: false,
                    message: "User already exists",
                });
            }

            

            const Otp = await this.generateOtp.generateOtp(4);

            const sendOtp = await this.sendMail.sendMail(firstName, email, Otp)


            if (!sendOtp.success) {

                return res.json({
                    sendOtp
                })

            }

          
            const response = await this.usercase.register(req.body, Otp)
          
            

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




    async verifyOtp(req: Request, res: Response) {
        try {
            let { otp,  id } = req.body

            console.log(req.body);

            // code = parseInt(code)


            const Otp = await this.usercase.verifyOtp( otp, id)


            if (!Otp.success) {
                return res.json({ success: false, message: 'an error occured try again' })
            }

            return res.json({ success: true, message: 'otp verified' })



        } catch (error: any) {

            return res.json({ success: false, message: error.message })
        }
    }
    async login(req: Request, res: Response) {
        try {
            let {  email, password } = req.body

    
        
            email = email.trim();
            password = password.trim();
          

            if ( !email || !password ) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                });
            }

            
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

                const user = await this.usercase.login({ email , password})
          
            

                if (!user) {
                    res.status(200).json({ message: 'Invalid credentials' });
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
    
    
            
      
    }





export default userController