import { Document, model, Schema } from 'mongoose';

export interface Message {
    text: string;
    timestamp?: Date;
    sender:string
}

export interface Chat {
    sender:string;
    receiver:string
    messages: Message[];
}

const chatSchema = new Schema(
    {
        member:[],
      
        messages: [
            {
                text: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now()
                },
                sender: {
                    type: Schema.Types.ObjectId,
                    ref: "user",
                    required: true,
                },
            },
        ],
    },
);

 const ChatModel = model<Chat & Document>('Chat', chatSchema);
 export default ChatModel
// export { Message }; 