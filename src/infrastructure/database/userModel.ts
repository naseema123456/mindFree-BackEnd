
import mongoose, { Document, Schema } from "mongoose";

interface User extends Document {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: number,
    password: string,
    image: string,
    role: string,
    isBlocked: boolean,
    isVerified: boolean,
    address: {
        streetAddress: string,
        landmark: string,
        city: string,
        state: string,
        country: string,
        pincode: string,
    },
  
    createdAt: Date,
    timeTolive: Date;
}

const userSchema: Schema<User> = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        // unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: { type: String },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user', 'callProvider'],
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
  
    address: {
        name: String,
        house: String,
        post: String,
        pin: Number,
        contact: Number,
        state: String,
        District: String,
    },
 
    createdAt: {
        type: Date,
        default: new Date()
    },
    timeTolive: {
        type: Date,
        default: function () {
          return new Date(Date.now() + 24 * 60 * 60 * 1000);
        //   return new Date(Date.now() + 1 * 60 * 1000);
        },
        index: { expires: 0 },
      }
})

const UserModel = mongoose.model<User>('user', userSchema)
export  { UserModel }