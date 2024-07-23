  import AppError from "../utils/error.utils.js";
import jwt  from "jsonwebtoken";
const isLoggedIn=async(req,res,next)=>{
  const{token} = req.cookies || req.cookies.token; 
  if(!token){
    return next(new AppError("Unauthanticated please login again",401 ))
  }
  const userDetails = await jwt.verify(token,process.env.SECRET);
  req.user = userDetails;
  next();
}

const authorizedRoles=(...roles)=>async(req,res,next)=>{
  const currentUserRoles = req.user.role;
  if(!roles.includes(currentUserRoles)){
    return next(
     new AppError("you do not have permission to access this routes",403)
    )
  }
  next();
}
export {
   isLoggedIn,
   authorizedRoles
  };