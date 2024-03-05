import { Request, Response } from "express";
import Userusecase from "../use_case/userUsecase";
import UserRepository from "../infrastructure/repository/userRepository";
import { UserModel } from "../infrastructure/database/userModel";
import GenerateOtp from "../infrastructure/utility/generateotp";
import SendMail from "../infrastructure/utility/sendmail";
import OtpRepository from "../infrastructure/repository/otpRepository";
import Otp from "../domain/otp";
import { Chat } from "../infrastructure/database/chat";
// import { Message } from "../domain/chat";
import ChatModel, { Message } from "../infrastructure/database/chat";
import { text } from "stream/consumers";
import { log } from "console";




class userController {
    private usercase: Userusecase
    private userRepository: UserRepository
    private generateOtp: GenerateOtp
    private sendMail: SendMail
    private otpRepository: OtpRepository


    constructor(usercase: Userusecase) {
        this.usercase = usercase
        this.userRepository = new UserRepository;
        this.generateOtp = new GenerateOtp()
        this.sendMail = new SendMail()
        this.otpRepository = new OtpRepository
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
            console.log("register");
            
            let { firstName, lastName, email, password, phoneNumber } = req.body



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
            let { otp, id } = req.body

            // console.log(req.body);

            // code = parseInt(code)


            const Otp = await this.usercase.verifyOtp(otp, id)


            if (!Otp.success) {
                return res.json({ success: false, message: 'an error occured try again' })
            }

            return res.json({ success: true, message: 'otp verified' })



        } catch (error) {

            return res.json({ success: false, message: 'an error occured try again'  })
        }
    }
    async login(req: Request, res: Response) {
        try {
            console.log("ho");
            
            let { email, password } = req.body


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

            const user = await this.usercase.login({ email, password })



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


            // console.log(user.message,"msg")


            res.status(200).json({
                success: true,
                message: "login successful",
                user: user?.user,
                isVerified: true,
                token: user?.token
            });


        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: 'false', message: 'error occured try again'
            })
        }
    }

    async resendotp(req: Request, res: Response) {
        try {

            let id = req.params.userId
            const existResponse = await this.userRepository.findById(id);

            if (existResponse && existResponse.success && existResponse.user) {


                const Otp = await this.generateOtp.generateOtp(4);

                const sendOtp = await this.sendMail.sendMail(existResponse.user.firstName, existResponse.user.email, Otp);

                if (sendOtp.success) {
                    const response = await this.usercase.resendotp(id, Otp)

                    if (!response?.success) {
                        return res.status(500).json(response)
                    }


                    res.status(response.status).json(response)
                }
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "server error"
            })
        }
    }


    async forgot(req: Request, res: Response) {
        try {

            const email = req.params.otpemail;
            const existResponse = await this.userRepository.findByEmail(email);
            // console.log(existResponse,'hiiiiiiiii');

            if (!existResponse.success) {

                return res.status(400).json({
                    success: false,
                    message: "This User not exist",
                });
            } else {
                const Otp = await this.generateOtp.generateOtp(4);

                if (existResponse.user) {
                    const firstName = existResponse?.user?.firstName;
                    const id = existResponse?.user?._id

                    const sendOtp = await this.sendMail.sendMail(firstName, email, Otp)


                    if (sendOtp.success) {
                        const response = await this.usercase.resendotp(id, Otp)


                        if (!response?.success) {
                            return res.status(500).json(response)
                        }


                        res.status(response.status).json(response)
                    }
                }

            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "server error"
            })
        }

    }


    async resetpassword(req: Request, res: Response) {
        try {
            // console.log(req.body);


            const password = req.body.password
            const id = req.body.id


            // Validate password
            if (!this.isValidPassword(password)) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters long",
                });
            }

            const response = await this.usercase.resetpassword(password, id)
            if (response.success) {
                res.status(200).json({
                    success: true,
                    message: 'Password reset successful',
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

    async profile(req: Request, res: Response) {
        try {
         
            const token = req.headers.authorization
            const response = await this.usercase.profile(token)
            // console.log(response.data?.user,"jjjjjjjjjj");

            res.status(response.status).json({

                data: response.data?.user,
            });
        } catch (error) {
            console.error("Error in profile endpoint:");
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    async appoinment(req: Request, res: Response) {
        try {
          
            const id = req.params.id
            const time = req.params.time
            const token = req.headers.authorization
            // console.log(token);
            const response = await this.usercase.appoinment(id, token, time)
            if (response) {

                const updatedAppointment = response.data;

                // Now you can send the updated appointment as a response
                res.status(200).json(updatedAppointment);
            } else {
                // Handle the case where there was an error
                res.status(500).json({ error: response });
            }
        } catch (error) {
            // Handle unexpected errors
            console.error('Unexpected error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    }

    async getTime(req: Request, res: Response) {
        try {
            // console.log(req.params);
            const id = req.params.userId
            const response = await this.usercase.getTime(id)
            res.status(200).json({
                success: true,
                message: response.message,
                data: response?.data,

            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: 'false', message: 'error occured try again'
            })
        }
    }

async gethistory(req: Request, res: Response){
    try {
        // console.log(req.params);
        const userId=req.params.userId
        const receiverId=req.params.receiverId
        const chat = await this.usercase.gethistory(userId,receiverId)
        res.status(200).json({ chat });
    } catch (error) {
        console.error('Error in gethistory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async getvideo(req: Request, res: Response){
    try {
        console.log(req.params);
        
        const id=req.params.userId
        const time=req.params.time
        const gettime = await this.usercase.getvideo(id,time)
        console.log(gettime,"controller");
        
return res.status(200).json(gettime)
    } catch (error) {
               console.error('Error in gethistory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async video(req: Request, res: Response){
    try {
        const id=req.params.id
        const response = await this.usercase.video(id)
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async contact(req: Request, res: Response){
    try {
console.log(req.body);
const subject=req.body.subject
const message=req.body.message
const token = req.headers.authorization
        const response = await this.usercase.contact(subject,message,token)
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
}

export default userController