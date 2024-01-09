import User from '../../domain/user'
import mongoose, { ObjectId } from "mongoose";

import { UserModel } from '../database/userModel'
// import UserRepository from '../../use_case/interface/userController'
import { AppointmentModel } from '../database/appoinment';
import Appointment from '../../domain/appoinment';

class UserRepository implements UserRepository{
    async create(user: User){
        try {
            console.log(user,"user");
            
            const response = await new UserModel(user).save();

     

            
            return {
                success: true,
                message: "user created",
                user:response

            }
        } catch (error) {
            return {
                 success : false,
                 message: "database error"
            }
        }
    }

    async findByEmail(email: string) {
        try {
            console.log('email exist check')
            const user = await UserModel.findOne({ email: email });
    
            if (user) {
                return {
                    success: true,
                    user,
                    message: 'user email found'
                };
            } else {
                return {
                    success: false,
                    message: "user not found",
                };
            }
        } catch (error) {
            return {
                success: false,
                message: "database error",
            };
        }
    }
    
    async findById(id: string) {
        try {
            console.log('email exist check')
            const user = await UserModel.findOne({ _id: id });
    
            if (user) {
                return {
                    success: true,
                    user,
                    message: 'user found'
                };
            } else {
                return {
                    success: false,
                    message: "user not found",
                };
            }
        } catch (error) {
            return {
                success: false,
                message: "database error",
            };
        }
    }
    async resetpassword(newPassword: string,id:string) {
        try {
            console.log(newPassword,id);
            let reset = await UserModel.updateOne({ _id: id }, { $set: { password :newPassword} });
            console.log(reset);
            if (reset.  modifiedCount === 1) {
                console.log('Password reset successful');
                // You can return a success response or perform additional actions if needed
                return { success: true, message: 'Password reset successful' };
              } else {
                console.log('User not found or password not updated');
                // Return an error response if the user is not found or password is not updated
                return { success: false, message: 'User not found or password not updated' };
              }
          
            } catch (error) {
              console.error('Error resetting password:', error);
              // Return an error response
              return { success: false, message: 'Internal server error' };
            }

    }
    
    async profile(id:string) {
        try {
            console.log(id);
            
            const userData = await UserModel.findOne({ _id:id })
            if (userData) {
             
            return {
                success: true,
          
                user:userData

            }
              } else {
                console.error("User not found");
                return { success: false, message: 'User not found' };
             
              }

        } catch (error) {
            console.error('Error resetting password:', error);
            // Return an error response
            return { success: false, message: 'Internal server error' };
        }
    }
    async appoinment(callProvider:string,id:string,time:string,date:Date){
        try {
            console.log(callProvider);
            
            const result = await AppointmentModel.updateOne(
                { callprovider: callProvider, time: time },
                { $set: { userId: id, time: time, date: date } }
              );
              
              console.log(result);
              
              if (result.modifiedCount === 1) {
                // Document was successfully updated
                const updatedAppointment = await AppointmentModel.findOne({
                  callprovider: callProvider,
                  time: time
                });
              
                console.log(updatedAppointment);
                return{
                    success: true,
          Message:"succfully updates appointment",
                    data:updatedAppointment
                }
              } else {
                // Document was not updated (maybe it didn't match the conditions)
                console.log('Document not updated');
                return{
                    success: false,
          Message:'Document not updated',
             
                }
              }
              
              
        } catch (error) {
            return { success: false, message: 'Internal server error' };
        }
    }

    async getTime(id:string|undefined){
        try {
            const objectId = new mongoose.Types.ObjectId(id);
            const userData = await AppointmentModel.find({ callprovider:objectId })
            console.log(userData);
            
            return {
                success: true,
                message: "getTime",
                data:userData

            }
        } catch (error) {
            return {
                 success : false,
                 message: "database error"
            }
    }
    }
    }

export default UserRepository