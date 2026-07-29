import api from "../api/axios"

export const authService = {
    signup:(username:string,email:string,password:string)=>
        api.post("/auth/signup",{username,email,password}),

    verifyOtp:(email:string,otp:string)=>
        api.post("/auth/verify-otp",{email,otp}),

    resendOtp:(email:string)=> api.post("/auth/resend-otp",{email}),

    login:(identifier:string,password:string)=>
        api.post("/auth/login",{identifier,password}),

    googleLogin:(credential:string) => api.post("/auth/google",{credential}),

    forgotPassword:(email:string) => api.post("/auth/forgot-password",{email}),

    resetPassword:(email:string,otp:string,newPassword:string)=>
        api.post("/auth/reset-password",{email,otp,newPassword}),

    logout:()=>api.post("/auth/logout"),

    getMe:()=>api.get("/auth/me"),
};