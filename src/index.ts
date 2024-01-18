import { createServer } from './infrastructure/config/app'

import http from 'http'
import { connectDb } from './infrastructure/config/connectDb'
import { Server, Socket } from 'socket.io'
import { Chat } from './infrastructure/database/chat';
import userController from './adapter/userController';
// import { Message } from './infrastructure/database/chat';
import ChatModel from "./infrastructure/database/chat";
import { Message } from "./infrastructure/database/chat";
import { log } from 'console';

import Userusecase from './use_case/userUsecase';
import UserRepository from './infrastructure/repository/userRepository';

const userRepository = new UserRepository();
const userUseCase = new Userusecase(userRepository);
const startServer = async () => {
    try {
        const PORT = process.env.PORT || 3000
        await connectDb()
        const app = createServer()    
        const server = http.createServer(app)
        const io = new Server(server, {
            cors: {
                origin: ['http://localhost:4200'],
                methods: ['GET', 'POST']
            }
        })
        const userSockets = new Map<string, string>();
        // Socket.io connection
        io.on('connection', (socket: Socket) => {

            console.log('user connected');
            const id = socket.handshake.query.id as string
         console.log(id,"id");
         
            log(socket.id, 'socket id')

            socket.on('chatMessage', async (chatData:Chat) => {
            userSockets.set(id, socket.id);
       console.log(chatData.receiver);
       
                const savedData = await userUseCase.sendMessage(chatData)
        
            
                socket.to(userSockets.get(chatData.receiver) as string).emit('recieve-message', savedData);
    
            });


            socket.on('disconnect', () => {
                console.log(' user disconnected');
                userSockets.delete(id)
            });
        });

        server.listen(PORT, () => {
            console.log('connected to the server')
        })
    } catch (error) {
        console.log(error)
    }
}

startServer()