import User from '../../domain/user'
// import mongoose, { ObjectId } from "mongoose";
import { UserModel } from '../database/userModel'
import { AppointmentModel } from "../database/appoinment";
import { NotificationModel } from '../database/notification';


class AdminRepository implements AdminRepository {


  async Users() {
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


  async findByEmail(email: string) {
    console.log('email exist check')
    const user = await UserModel.findOne({ email: email })

    if (user) {
      return {
        success: true,
        user,
        message: 'user email found'
      }
    } else {
      return {
        success: false,
        message: "user not found",
      };
    }
  } catch() {
    return {
      success: false,
      message: "database error",
    };
  }


  async create(user: User) {
    try {
      // console.log(user,"user");

      const response = await new UserModel(user).save();
      await response.updateOne({ $unset: { timeTolive: 1 } });


      return {
        success: true,
        message: "user created",
        user: response

      }
    } catch (error) {
      return {
        success: false,
        message: "database error"
      }
    }
  }

  async getUser(id: string) {
    try {

      const userData = await UserModel.findById({ _id: id });

      if (userData) {
        // User found, you can do something with the data
        // console.log(userData, 'repository...........');
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


  async editUser(role: string, id: string) {
    try {
      // console.log(role,'repository.................');
      const editData = await UserModel.updateOne({ _id: id }, { $set: { role } });
      // console.log(editData);

      if (editData.modifiedCount === 1) {
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

  async Bloked(isBlocked: boolean, id: string) {
    try {
      // console.log("repo...........");
      if (isBlocked === true) {

        let Blocked = await UserModel.updateOne({ _id: id }, { $set: { isBlocked: false } });
        // console.log(Blocked);
        if (Blocked.modifiedCount === 1) {
          // Successfully updated one document
          console.log('User unblocked successfully');
          return { success: true, message: 'User unblocked successfully' };
        } else {
          // No document was modified, meaning the user with the provided ID might not exist
          console.log('User not found or not updated');
          return { success: false, message: 'User not found or not updated' };
        }
      } else {
        let Blocked = await UserModel.updateOne({ _id: id }, { $set: { isBlocked: true } });
        console.log(Blocked);
        if (Blocked.modifiedCount === 1) {
          // Successfully updated one document
          console.log('User blocked successfully');
          return { success: true, message: 'User blocked successfully' };
        } else {
          // No document was modified, meaning the user with the provided ID might not exist
          console.log('User not found or not updated');
          return { success: false, message: 'User not found or not updated' };
        }
      }



    } catch (error) {

    }
  }


  async getMarket() {
    try {
      // const appointmentsWithUserId = await AppointmentModel.find({ userId: { $exists: true, $ne: null } });
      const appointmentsWithUserId = await AppointmentModel.find({ userId: { $exists: true, $ne: null } })
        .populate({
          path: 'callprovider',
          select: 'firstName lastName'
        })
        .exec();



      return appointmentsWithUserId

    } catch (error) {
      return { success: false, message: 'Internal Server Error' };
    }
  }
async getMessages(){
  try {
    const message = await NotificationModel.find().populate({
      path: 'sender',
      select: 'firstName lastName'
    });
    
    console.log(message,"message");
    return message
    
  } catch (error) {
    return { success: false, message: 'Internal Server Error' };
  }
}

}

export default AdminRepository