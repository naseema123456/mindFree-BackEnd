import { Document, model, Schema } from 'mongoose';

export interface Message {
    subject: string;
    message:string
}

export interface IApimsg {
    sender:string;
    date?: Date;
    messages: Message;
}

const NotificationSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        messages: {
           subject: {
                type: String,
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
        },
        date: {
            type: Date,
            default: Date.now()
        },
      
      
    },
);

 const NotificationModel = model<IApimsg & Document>('notification', NotificationSchema);
 export {NotificationModel}
