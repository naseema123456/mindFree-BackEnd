import profileRepository from "../infrastructure/repository/profileRepository"
import Encrypt from "../passwordservice/hashpassword"
import JWTtoken from "../passwordservice/jwt"
import User from "../domain/user";

class profileUsecase{
    private profileRepository : profileRepository
    // otpRepository: OtpRepository;
    private encrypt: Encrypt
    private jwtToken: JWTtoken

    constructor(profileRepository:profileRepository){
        this.profileRepository = profileRepository
        this.encrypt = new Encrypt()
        this.jwtToken = new JWTtoken()
      
    }

async upload(file:string|undefined,token:string|undefined){
    try {
        console.log("use profile......");
    
        const claims = this.jwtToken.verifyJWT(token)
        if(!claims) return {
            status: 401,
            success: false,
            message: "Unauthenticated"
    
    
        }
        const id=claims.id
        const response = await this.profileRepository.upload(id,file )
        if (response?.success) {
            return {
                status: 200,
                success: true,
                message: "Profile image uploaded successfully",
            }
           
          
          } else {
            return{

                status: 400,
                success: false,
                message: response?.message,
          
            }
         
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          return{

              status: 500,
              success: false,
              message: "Internal server error",
          }
      
        }
}
async update(user:User){
    try {

        
        console.log(user,"userrrrrrrrrrr");
        
        const NewUser: User = {
            ...user, 
            id:user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address:user.address
            
        }
        console.log(NewUser,"Newuaser");
        
        const response = await this.profileRepository.update(NewUser)
        if (response?.success) {
            return {
                status: 200,
                success: true,
                message:response.message,
            }
           
          
          } else {
            return{

                status: 400,
                success: false,
                message: response?.message,
          
            }
         
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          return{

              status: 500,
              success: false,
              message: "Internal server error",
          }
}

}
}
export default profileUsecase