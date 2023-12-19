import express from 'express'
import userRouter from '../route/userRoute'
// import adminRouter from '../route/adminRoute'
import path from 'path';
const cors = require('cors')
export const createServer = () => {
    try {
        const app = express()
        app.use(express.json())

        app.use(cors({
            credentials:true,
            origin:['http://localhost:4200']
        }))
        app.use(express.urlencoded({ extended: false }));
        app.use(express.static(path.join(__dirname, 'public')));

          // Routes
          app.use('/user', userRouter)


        return app
    }
    catch (error) {
        console.log(error)
    }
}