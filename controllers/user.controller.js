import AppError from "../utils/error.utils.js";
import User from "../models/user.model.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import { error } from "console";
import sendEmail from "../utils/send.email.js";
import crypto from 'crypto';
const cookieOptions = {
  maxAge:7*24*60*60*1000,
  httpOnly:true,
  secure:true
}
const register=async(req,res,next)=>{
  const{fullName,email,password}  = req.body;
  if( !fullName|| !email || !password){
    return next(new AppError(`All field are required`,400));
  }
  const userExists = await User.findOne({email});
  if(userExists){
    return next(new AppError(`email already exists`,400)); 
  }
  const user = await User.create({
    fullName,
    email,
    password,
    avatar:{
      public_id:'',
      secure_url:""
    }
  });
  if(!user){
    return next(new AppError(`email already exists`,400)); 
  }
  if(req.file){
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path,{
        folder:'lms',
        width: 250,
        height:250,
        gravity:'faces',
        crop:'fill'
      });
      if(result){
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url=result.secure_url;

        // Remove file from server 
       await fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppError(error || 'File not uploaded , please try again later',500)  
      )
    }
  }
  await user.save();

  user.password = undefined;

  const token = await user.generateJWTToken();
  res.cookie('token',token,cookieOptions)
  res.status(201).json({
    success:true,
    message:'User registered successfully',
    user
  });
}

const login=async(req,res,next)=>{
  try {
    const {email,password} = req.body;
    if(!email || !password){
      return next(new AppError("All fields are required",400));
    }
    const user = await User.findOne({email}).select('+password');
  
    if(!user || ! (await user.comparePasswrod(password))){
      return next(new AppError("Email or Password does not match",400));
    }
  
    const token = await user.generateJWTToken();
    user.password = undefined;
  
    res.cookie('token',token,cookieOptions);
    res.status(200).json({
      success:true,
      message:'user login succesfully',
      user
    });
  } catch (error) {
    return next(new AppError(error.message,500));

  }
}

const logout=(req,res)=>{
  res.cookie("token",null,{
    secure:true,
    maxAge:0,
    httpOnly:true
  })

  res.status(200).json({
    success:true,
    message:'logout successfully'
  })
}

const getProfile =async(req,res,next)=>{
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    return res.status(200).json({
      success:true,
      message:'user details',
      user
    })
  } catch (error) {
    return next(new AppError(error.message,500));
  }
}

const forgotPassword = async(req,res,next)=>{
  const {email} = req.body;
  
  if(!email){
    return next(new AppError('email is required',400));
  }

  const user = await User.findOne({email});
  if(!user){
    return next(new AppError('email not registered',400));
  }

  const resetToken = await user.generatePasswordResetToken();

  await user.save();  

  const resetPasswordUrl= `http://localhost:5000/api/v1/user/reset/${resetToken}`;

  const subject = 'Reset Password'
  const message = `you can reset your password:- ${resetPasswordUrl}`;
  try {
    await sendEmail(email, subject, message);
    res.status(200).json({
      success:true,
      message:`Reset password token has been sent to ${email} successfully`
    })
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();
    return next(new AppError(error.message,500));
  }

}
const resetPassword = async(req,res,next)=>{
  const{resetToken}=req.params; 
  const {password}=req.body;
  const forgotPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex'); 
  const user =await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry:{$gt: Date.now()} 
  });
  if(!user){
    return next(new AppError("Token is invalid please try again",400));
  }
  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  res.status(200).json({
    success:true,
    message:'password updated successfully'
  });
}

const changePassword=async(req,res,next)=>{
  const{oldPassword,newPassword} = req.body;
  const{id} = req.user;
  if(!oldPassword||!newPassword){
    return next(
      new AppError("All fields are mendatory",400)
    )
  }
  const user = await User.findById(id).select('password');

  if(!user){
    return next(
      new AppError("user does not exists",400)
    )
  }
  const isPassValid = await user.comparePasswrod(oldPassword);

  if(!isPassValid){
    return next(
      new AppError("Invalid old password",400)
    )
  }

  user.password = newPassword;
  await user.save();

  user.password = undefined;

  res.status(200).json({
    success:true,
    message:'password changed successfully',
    user:user

  })
}

const updateUser=async(req,res,next)=>{
  const{fullName} = req.body;
  const{id}=req.user.id;    
  const user = User.findById(id);
  if(!user){
    return next(
      new AppError('user does not exists',400)
    )
  }
  if(req.fullName){
    user.fullName  = fullName;
  }
  if(req.file){
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path,{
        folder:lms,
        width:250,
        height:250,
        gravity:'faces',
        crop:'fill'
      });
      if(result){
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url  = result.secure_url;

        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppError(error,500)
      )
    }
  }
  await user.save();
  res.status(200).json({
    success:true,
    message:'User details update successfully'
  });
}
export {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  changePassword,
  resetPassword,
  updateUser
}