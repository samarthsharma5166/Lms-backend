import {model,Schema} from 'mongoose';
const paymentSchema = new Schema({
  razorpay_payment:{
    type:String,
    required:true
  },
  razorpay_subscription_id:{
    type:String,
      required:true,
  },
  razorpay_signature:{
    type:String,
  }
},{
  timestamps:true
});
const Payment = model('Payment',paymentSchema);

export default Payment;