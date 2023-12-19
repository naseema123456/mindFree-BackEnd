import mongoose,{Types} from 'mongoose';

interface Otp{
        // userId:Types.ObjectId;
        id:Types.ObjectId;
        otp: number;
        expiresAt: Date;
        createdAt:Date
      }

export default Otp