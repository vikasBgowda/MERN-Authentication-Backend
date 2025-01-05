import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie=async(res,userId)=>{
    console.log("user ID = ",userId)
    const token=jwt.sign({userId: userId},process.env.JWT_SECRET_KEY,{
        expiresIn:'5d'
    });
    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict",
        maxAge:5 * 24 * 60 * 60 * 1000
    })
    console.log("token = ",token)
    return token;
} 
