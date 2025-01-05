import jwt from 'jsonwebtoken'

export const verifyToken=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token) return res.status(401).json({
        success:false,
        message:"UnAuthorized No - vaild token "
    })
    try {
        const decode=jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!decode) return res.status(401).json({
            success:false,
            message:"UnAuthorized No - vaild token "
        })
        console.log("value",decode)
        req.userId=decode.userId;  
        next();            
    } catch (error) {
        console.log("error in the verification token")
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}