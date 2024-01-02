
interface User {
    id?: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: number,
    password: string,
    image?: string,
    role: string,
    isBlocked: boolean,
    isVerified: boolean,

    address?: {
        name: String,
        house: String,
        post: String,
        pin: Number,
        contact: Number,
        state: String,
        District: String,
       
    },

    createdAt?: Date,
    timeTolive?:Date|number
}

export default User