
import { UserModel } from '../database/userModel'
import User from '../../domain/user';

class profileRepository{


async upload(id:string,file:string|undefined){
    try {
         const updateImg = await UserModel.updateOne(
            {_id:id},
            {
                $set:{
                    image:file
                }
            }
        );
        console.log(updateImg);
       
            if (updateImg.modifiedCount === 1) {
                console.log('User image updated successfully');
                return { success: true, message: 'User image updated successfully' };
              } else {
                console.log('User not found or image update failed');
              }
            } catch (error) {
              console.error('Error updating user image:', error);
              return { success: false, message: 'Error updating user image' };
            }
  
        }


        async update(user:User){
          try {
            console.log(user,"repo");
            
            const updatedUser = await UserModel.findByIdAndUpdate(
              user.id,
              {
                $set: {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  phoneNumber: user.phoneNumber,
                  ...(user.address && {
                    'address.name': user.address.name,
  'address.house': user.address.house,
  'address.post': user.address.post,
  'address.pin': user.address.pin,
  'address.contact': user.address.contact,
  'address.state': user.address.state,
  'address.District': user.address.District,
                  }),
                }
              },
              { new: true } // Return the updated document
            );
          
            console.log(updatedUser, "Updated User");
            // console.log(reset);
            
            if (updatedUser) {
              console.log(updatedUser, "Updated User");
              return { success: true, message:  "Updated User" };
            } else {
              console.log("User not found for update");
              return { success: false, message:  "User not found for update"};
            }
          } catch (error) {
            console.error("Error updating user:", error);
            return { success: false, message: "Error updating user" };
          }
        }
    }


export default profileRepository