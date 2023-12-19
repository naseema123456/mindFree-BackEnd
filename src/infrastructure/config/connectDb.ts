import mongoose from "mongoose";
require('dotenv').config()

export const connectDb = async()=>{
    try {
        // const mongo_uri = 'mongodb://127.0.0.1:27017/mindFreeTrading'
        const mongo_uri = process.env.mongoDB_Link!
        await mongoose.connect(mongo_uri)
        console.log('connected to db')
    } catch (error) {
        console.log(error)
    }
}