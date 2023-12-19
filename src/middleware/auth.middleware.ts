import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface User{
    id:string,
    role:string
}

  

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers.authorization;

    // console.log(authToken);
    
    //check token exist

    if (!authToken ) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    try {

        const token=authToken
    
        

        const jwtSecret: string = process.env.JWT_SECRET!;

        const decoded = jwt.verify(token, jwtSecret) as User;

        console.log(decoded,"aut");
        

        (req as any).user=decoded;

        const role=(req as any)?.user?.role;

        if(!role){
            return res.status(401).json({ message: 'Role not found in token' });
        }
      

        next()
        
    } catch (error) {
         console.error(error);
        return res.status(403).json({ success: false, message: 'Token verification failed' });
    }

}

