import {userModel} from '../models/user.model.js'
import bcrypt from 'bcrypt';

import crypto from 'crypto';

import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeMail , resetPasswordMail , sendSetSuccessMail} from '../mailtrap/emails.js';

export const checkAuth=async(req,res)=>{
    try {
        console.log(req.userId)
        const user=await userModel.findById(req.userId).select("-password")
        if(!user){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })
        }
        res.status(200).json({success:true, user})
    } catch (error) {
        console.log("error in checking the user auth");
        res.status(400).json({success:false,message:error.message} )
    }
}

export const signup=async(req,res)=>{
    const {email,password,name}=req.body;
    try {
        if(!email || !password || !name){
            throw new Error("All Fields are required");
        }
        const AlreadyUser=await userModel.findOne({  email })
        if(AlreadyUser){
            return res.status(400).json({
                success:false,
                message:"user already exists"
            })
        }

        const hashPassword=await bcrypt.hash(password,10);

        const verificationToken=Math.floor(100000 + Math.random() * 900000).toString();
        const newUser= new userModel({
            email:email,
            password:hashPassword,
            name:name,
            verificationToken:verificationToken,
            verificationTokenExpiresAt:new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        })
        await newUser.save();
        generateTokenAndSetCookie(res,newUser._id)
        await sendVerificationEmail(newUser.email,verificationToken);

        res.status(201).json({
            success:true,   
            message:'user is created successfully',
            user:{
                ...newUser._doc,
                password: undefined
            }
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
} 

export const verifyEmail =async (req,res)=>{
    const {code}=req.body;
    try {
        const user=await userModel.findOne({
            verificationToken:code,
            verificationTokenExpiresAt:{$gt:Date.now()}
        })
        if(!user){
            return res.status(401).json({
                message:"Invaild or expired code",
                success:false
            })
        }
            user.isVerified=true;
            user.verificationToken=undefined;
            user.verificationTokenExpiresAt=undefined;
            user.save();

            await sendWelcomeMail(user.email,user.name);
            res.status(201).json({message:"Welcome mail sent successfully", success:true,
                user:{
                    ...user._doc,
                    password:undefined
                }
            });

    } catch (error) {
        console.log(error);
    }

}

export const login=async (req,res)=>{
    const{ email , password }=req.body;
    try {
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please enter all the fields"
            })
        }
        const checkUser=await userModel.findOne({
            email
        })
        if(!checkUser){
            return res.status(400).json({
                success:false,
                message:"Invaild credentials"
            })
        }
        const checkPassword=await bcrypt.compare(password,checkUser.password);
        if(!checkPassword){
            return res.status(400).json({
                success:false,
                message:"Invaild credentials"
            })
        }
        generateTokenAndSetCookie(res,checkUser._id);
        checkUser.lastlogin=new Date();
        res.status(200).json({
            success:true,
            message:"you have logged in sucessfully",
            user:{
                ...checkUser._doc,
                password:undefined
            }
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:`Error message ${error}`
        })
    }
    

} 

export const logout=(req,res)=>{
    res.clearCookie("token");
    res.status(200).json({
        success:true,
        message:"User is logout successfully"
    })
}

export const forgotPassword=async(req,res)=>{
    
    const {email}=req.body; 
    try {
        const user=await userModel.findOne({
            email
        })
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invaild email"
            })
        }
        const resetToken=crypto.randomBytes(20).toString("hex");
        const resetTokenExpireAtDate=Date.now() + 1 * 60 * 60 * 1000 ; // 1 hour
        
        user.resetPasswordToken=resetToken;
        user.resetPasswordExpiresAt=resetTokenExpireAtDate;
        await user.save();
 
        // reset password email
        await resetPasswordMail(user.email,`${process.env.RESET_URL}/reset-password/${resetToken}`)
        res.status(200).json({
            success:true,
            message:"Password reset link sent to mail"
        })
    } catch (error) {
        console.log("Error in the forgot password mail")
        res.status(400).json({ success: false, message: error.message });   
    }

}

export const resetPassword=async(req,res)=>{
    const {token}=req.params;
    console.log(token)
    const { password } =req.body;
    try {
        const user=await userModel.findOne({
            resetPasswordToken:token,
            resetPasswordExpiresAt:{$gt:Date.now()}
        })
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invaild or Expired link"
            })
        }
        const HashPassword = await bcrypt.hash(password,10);
        user.password=HashPassword;
        user.resetPasswordToken=undefined
        user.resetPasswordExpiresAt=undefined

        await user.save();
        // reset success Mail
        await sendSetSuccessMail(user.email);
        res.status(200).json({
            success:true,
            message:"Password is reset successfully"
        })

    } catch (error) {
        console.log("error in reseting the password")
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}