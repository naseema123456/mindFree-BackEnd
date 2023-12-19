import User from '../../domain/user'
import mongoose, { ObjectId } from "mongoose";
import { UserModel } from '../database/userModel'
// import UserRepository from '../../use_case/interface/userController'

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

    async findByEmail(email:string){
        console.log('email exist check')
     const user=await UserModel.findOne({email:email})

            if(user){
                return{
                    success:true,
                   user,
                   message:'user email found'
                }  
            }else {
                return {
                  success: false,
                  message: "user not found",
                };
              }
        } catch () {
            return {
                success: false,
                message: "database error",
              };
        }
    }

export default UserRepository