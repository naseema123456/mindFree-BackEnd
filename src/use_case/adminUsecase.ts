import User from "../domain/user";
import adminRepository from "../infrastructure/repository/adminRepository";
import Encrypt from '../passwordservice/hashpassword';
import JWTtoken from '../passwordservice/jwt';

import mongoose, { Types } from "mongoose";



class Adminusecase {
    private adminRepository: adminRepository
    // private otpRepository: OtpRepository
    private encrypt: Encrypt
    private jwtToken: JWTtoken
    constructor(adminRepository: adminRepository) {
        this.adminRepository = adminRepository
        //     this.otpRepository = new OtpRepository
        this.encrypt = new Encrypt()
        this.jwtToken = new JWTtoken()
    }




    async login(credentials: { email: string, password: string }) {

        try {

            const { email, password } = credentials


            const response = await this.adminRepository.findByEmail(email)
            console.log(response, '.....adminUsecase...........');


            if (response.success) {
                const storedAdmin = response.user;

                if (storedAdmin && storedAdmin.password) {
                    const passwordMatch = await this.encrypt.compare(password, storedAdmin.password);

                    if (!passwordMatch) {
                        // Incorrect password
                        return {
                            status: 401,
                            success: false,
                            message: "Invalid password",
                        };
                    }


                    const userId = storedAdmin?._id?.toString() || '';
                    const role = storedAdmin?.role || ''
                    const token = this.jwtToken.createJWT(userId, role);



                    // Password is correct then // checking is blocked or not

                    if (storedAdmin?.isBlocked) {
                        return {
                            message: 'admin blocked',
                            user: storedAdmin,
                        }
                    }



                    console.log(storedAdmin.role, 'adminUsecase..........');

                    if (storedAdmin?.role !== "admin") {
                        return {
                            message: 'You are not a admin',
                            user: storedAdmin,
                        }
                    }
                    if (storedAdmin?.role === "admin") {

                        return {
                            status: 200,
                            token,
                            user: storedAdmin,
                            success: true,
                            message: "Login successful",
                        }
                    }


                } else {
                    // User or password not found
                    return {
                        status: 401,
                        success: false,
                        message: "You are not a admin",

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
async Users(){
    try {
        console.log('admin Usecase.....');
        
        const response = await this.adminRepository.Users()
 
        if (response.success) {
       
    
            // Perform additional actions if needed
    
            return {
              success: true,
              message: 'Successfully retrieved users',
              data: response.data,
            };
          } else {
            // No users found
            console.error(response.message);
    
            // Perform additional actions if needed
    
            return {
              success: false,
              message: 'Failed to retrieve users',
            };
          }
    } catch (error) {
        return {
            status: 500,
            success: false,
            message:'An error occurred while retrieving users'
        }
    }

}

async addUser(user:User){
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
        isVerified: true, 
        
     }
    const response = await this.adminRepository.create(NewUser)
console.log(response,'.......admin usecase.........');

    if (!response.success) {
        return {
            status: 500,
            success: false,
            message: response.message,
            // user:response.user
        }
    }
    return {
        status: 200,
        success: true,
        message: response.message ,
        user: response?.user,
        email: response.user?.email,
        id: response.user?._id
    }


} catch (error: Error) {
    return {
        status: 500,
        success: false,
        message: "server error"

    }
}
async getUser(id:string){
    try {
        const response = await this.adminRepository.getUser(id)
        if (response) {
            // User data is available, you can do something with it
            console.log(response, 'adminusecase.........');
            return response; // or process the data as needed
          } else {
            // Handle the case where the user is not found
            console.log('User not found');
            return null; // or throw an error, or handle it differently
          }
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}


async editUser(role:string,id:string){
    try {
       console.log(role,'........usecase.');
       
       
        
        const response = await this.adminRepository.editUser(role,id)
        if (response.success) {
            console.log('User updated successfully');
            return { success: true, message: 'User updated successfully' };
        } else {
            console.log('User not found or not updated');
            return { success: false, message: 'User not found or not updated' };
        }
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
}

async Bloked(isBlocked:boolean,id:string){
    try {
        console.log("use...........");
        console.log(isBlocked,'fxxxxxxxxxxx');
        
        const response = await this.adminRepository.Bloked(isBlocked,id)
        if (response && response.success) {
            console.log('User updated successfully');
            return { success: true, message: 'User updated successfully' };
        } else {
            console.log('User not found or not updated');
            return { success: false, message: 'User not found or not updated' };
        }
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
    }
}



export default Adminusecase