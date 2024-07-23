import AppError from '../utils/error.utils.js'
const getRazorPayApIKey=(req,res,next)=>{
  try {
    
  } catch (error) {
    return next(
      new AppError(error,500)
    )
  }
}

const buySubscription=(req,res,next)=>{
  try {
    
  } catch (error) {
    return next(
      new AppError(error,500)
    )
  }

}

const verifySubscription=(req,res,next)=>{
  try {
    
  } catch (error) {
    return next(
      new AppError(error,500)
    )
  }

}

const cancelSubscription=(req,res,next)=>{
  try {
    
  } catch (error) {
    return next(
      new AppError(error,500)
    )
  }
  
}


export  {
  getRazorPayApIKey,
  buySubscription,
  verifySubscription,
  cancelSubscription
}