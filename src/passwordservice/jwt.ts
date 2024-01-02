import { log } from 'console';
import jwt from '../use_case/interface/jwt.type'
import JWT from 'jsonwebtoken'
require('dotenv').config();
class JWTtoken implements jwt {

    createJWT(userId: string, role: string): string {

        
        
        const jwtKey=process.env.JWT_SECRET;
        
        if(jwtKey){
            
        
            const token:string=JWT.sign({id:userId,role:role},jwtKey)

            return token
        }
        throw new Error("JWT_KEY is not defined");
    }

    verifyJWT(token:any):any{
      
        const tokenWithoutBearer = token.replace('Bearer ', '');
        const jwtKey=process.env.JWT_SECRET;
      
        
        if (jwtKey) {
            const claims = JWT.verify(tokenWithoutBearer, jwtKey);
            console.log("Verification successful");
            console.log(claims);
            return claims;
          }
    }

}

export default JWTtoken