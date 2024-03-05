import express from 'express'
import userRouter from '../route/userRoute';
import adminRouter from '../route/adminRoute';
import profileRouter from '../route/profileRoute';
import callprovider from '../route/callproviderRoute';
// import {SocketServer} from '../../socket/socket.io'
import path from 'path';
const cors = require('cors')
export const createServer = () => {
    try {
        const app = express()
 
    
        app.use(cors({
            credentials:true,
            origin:['https://mind-free.vercel.app']
            // origin:['http://localhost:4200']
        }))
        app.use(express.json())
        app.use(express.urlencoded({ extended: false }));
        app.use(express.static(path.join(__dirname, '../public')));
        


          // Routes
          app.use('/user', userRouter)
          app.use('/admin', adminRouter)
          app.use('/profile', profileRouter)
          app.use('/callprovider', callprovider)

        //   const server = require('http').Server(app); 
        //   SocketServer(server)
        return app
    }
    catch (error) {
        console.log(error)
    }
}