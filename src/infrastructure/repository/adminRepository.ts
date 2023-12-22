import User from '../../domain/user'
import mongoose, { ObjectId } from "mongoose";
import { UserModel } from '../database/userModel'

class AdminRepository implements AdminRepository{


        async Users(){
          try {
            console.log('admin repository......');
            
            const Users = await UserModel.find()
            if (Users && Users.length > 0) {
       
              return {
                success: true,
                message: 'Users found',
                data: Users, // Optionally return the users data if needed
              };
            } else {
              console.log('Users not found');
              return {
                success: false,
                message: 'No users found',
              };
            }


          } catch (error) {
            return {
              success: false,
              message: "database error",
            };
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


            async create(user: User){
              try {
                  console.log(user,"user");
                  
                  const response = await new UserModel(user).save();
                  await  response.updateOne({ $unset: { timeTolive: 1 } });
      
           
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
      
async getUser(id:string){
  try {
    
const userData = await UserModel.findById({ _id:id});

if (userData) {
  // User found, you can do something with the data
  console.log(userData, 'repository...........');
  return userData; // Or do something else with the data
} else {
  // User not found
  console.log('User not found');
  return null; // Or throw an error, or handle the case differently
}
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}


async editUser(isBlocked:boolean,role:string,id:string){
  try {
    console.log(isBlocked,role,'repository.................');
    const editData = await UserModel.updateOne({ _id: id }, { $set: { isBlocked, role } });
    console.log(editData);
    
    if (editData.  modifiedCount === 1) {
      // Successfully updated one document
      console.log('User updated successfully');
      return { success: true, message: 'User updated successfully' };
  } else {
      // No document was modified, meaning the user with the provided ID might not exist
      console.log('User not found or not updated');
      return { success: false, message: 'User not found or not updated' };
  }
} catch (error) {
  console.error(error);
  // Handle the error, e.g., return an error response
  return { success: false, message: 'Internal Server Error' };
}

        }


      }

export default AdminRepository