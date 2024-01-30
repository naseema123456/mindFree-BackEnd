import User from '../../domain/user'
import mongoose, { ObjectId } from "mongoose";
import ChatModel, { Chat } from "../../infrastructure/database/chat";
import { UserModel } from '../database/userModel'
// import UserRepository from '../../use_case/interface/userController'
import { AppointmentModel } from '../database/appoinment';
import Appointment from '../../domain/appoinment';
import { IApimsg } from '../database/notification';
import { NotificationModel } from '../database/notification';

class UserRepository implements UserRepository{
    async create(user: User){
        try {
            // console.log(user,"user");
            
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
                    user:user,
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
            // console.log(newPassword,id);
            let reset = await UserModel.updateOne({ _id: id }, { $set: { password :newPassword} });
            // console.log(reset);
            if (reset.modifiedCount === 1) {
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
            // console.log(id);
            
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
            // console.log(callProvider);
            
            const result = await AppointmentModel.updateOne(
                { callprovider: callProvider, time: time },
                { $set: { userId: id, time: time, date: date } }
              );
              
            //   console.log(result);
              
              if (result.modifiedCount === 1) {
                // Document was successfully updated
                const updatedAppointment = await AppointmentModel.findOne({
                  callprovider: callProvider,
                  time: time
                });
              
                // console.log(updatedAppointment);
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
            // console.log(userData);
            
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

    async gethistory(userId:string,receiverId:string){
try {
    // const chats = await ChatModel.find({
    //     $all: [
    //         {  userId, },
    //         {  receiverId}
    //     ]
    // });

    const chats = await ChatModel.find({
        member: {
            $all: [userId, receiverId]
        }
    });
    
// Assuming 'chats' is the array of chat entries you retrieved

// for (const chat of chats) {
//     console.log('Chat ID:', chat._id);
//     console.log('Sender ID:', chat.sender);
//     console.log('Receiver ID:', chat.receiver);

//     // Accessing individual messages in the 'messages' array
//     console.log('Messages:');
//     for (const message of chat.messages) {
//         console.log(' -', message);
//     }

//     console.log('Version:', chat.__v);
//     console.log('------------------------');
// }


    return chats;
} catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
}
    }

    async getvideo(id: string, time: string) {
        try {
          const getTimeArray = await AppointmentModel.find({
            $or: [
              { $and: [{ userId: id }, { time: time }] },
              { $and: [{ callprovider: id }, { time: time }] }
            ]
          });
      
        //   for (const getTime of getTimeArray) {
        //     const userId = getTime.userId?.toString();
        //     const callprovider = getTime.callprovider?.toString();
      
        //     if (userId == id) {
        //       console.log(getTime.callprovider, "get callprovider");
        //       return getTime.callprovider;
        //     }
      
        //     if (callprovider == id) {
        //       console.log(getTime.userId, "get userId");
        //       return getTime.userId;
        //     }
        //   }
        const recId=getTimeArray[0]._id.toHexString()
        console.log(recId,"getTimeArray");
        
      return recId
          // Handle the case when none of the conditions are met.
        } catch (error) {
          // Handle errors appropriately
          console.error(error);
        }
      }
      async video(id:string|undefined){
        try {
            const response = await AppointmentModel.find({_id:id})
            console.log(response,"resp");
            return response
        } catch (error) {
            console.error(error);
        }
      }
      async contact(NewAppointment:IApimsg){
        try {
            const response = await new NotificationModel(NewAppointment).save();
            console.log(response,"resp");
            // return response
            return {
                success: true,
                message: "notification created",
                user:response

            }
        } catch (error) {
            return {
                 success : false,
                 message: "database error"
            }
        }
      
    }
    async sendvideo(id:string|undefined,userId:string|undefined){
        try {
            const response = await AppointmentModel.find({_id: id});
console.log(response);
            if (response && response.length > 0) {
                if (response[0].callprovider && response[0].callprovider.toString() === userId) {
                    return response[0].userId;
                }
                if (response[0].userId && response[0].userId.toString() === userId) {
                    return response[0].callprovider;
                }
            }
            // 
            
        } catch (error) {
            
        }
    }
}
export default UserRepository