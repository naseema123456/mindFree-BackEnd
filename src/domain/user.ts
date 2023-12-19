
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
        streetAddress: string,
        landmark: string,
        city: string,
        state: string,
        country: string,
        pincode: string,
    },

    createdAt?: Date,
    timeTolive?:Date|number
}

export default User