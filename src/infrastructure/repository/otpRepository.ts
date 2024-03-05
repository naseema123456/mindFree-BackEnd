import OTP from '../database/otp';
import Otp from '../../domain/otp';
import {UserModel} from "../../infrastructure/database/userModel"

class OtpRepository {
  async SaveOtp(otp: Otp) {
  
    
    try {
      const { id } = otp;


      // Delete old OTP records for the user
      await OTP.deleteMany({ id });

      // Save the new OTP
      const response = await new OTP(otp).save();


      if(response){
        return {
            success: true,
            message: 'OTP saved',
          };
      }else{
        return {
            success: false,
            message: 'error occured while saving',
          };
      }
     
    } catch (error) {
      console.error('Error saving OTP:', error);
      return {
        success: false,
        message: 'Error saving OTP',
      };
    }
  }

  async findOtpByidAndCode(id: string, otp: number): Promise<{ success: boolean,message?:string ,}> {
    let Otp = otp;
    // Check if the OTP with the provided email and code exists in the database
    let userid =id

    const existingOtp = await OTP.findOne({ id:userid });
console.log(existingOtp,"existing otp................");

    if (existingOtp) {
        let curr = Date.now();

        if (curr > existingOtp.expiresAt.getTime()) {
            return { success: false,message:"expired" };
        }
        if(existingOtp.otp==Otp){
          const response = await UserModel.findOne({_id:userid })
          console.log(response,"........................response");
          
  if (response) {

       
        await  response.updateOne({ $unset: { timeTolive: 1 } });
          response.isVerified = true;
          await response.save();

return{success:true,message:"OTP verified"}

          
        }

     
      }
    }   return { success: false,message:"invalid otp" };
  }

 

    
    

}

  


export default OtpRepository;