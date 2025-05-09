import { Schema,model } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import crypto from 'crypto';
const userSchema = new Schema({
  fullName:{
    type:'String',
    required:[true,'Name is requried'],
    minLength:[5,'Name must be at least 5 character'],
    maxLength:[50,"Name should be less than 50 characters"],
    lowercase:true
  },
  email:{
    type:'String',
    required:[true,"Email is required!"],
    lowercase:true,
    trim:true,
    unique:true,
    match:[
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      'please enter a valid email'
    ]
  },
  password:{
    type:'String',
    required:true,
    minLength:[8,'password must have at least 8 chatacter'],
    select:false
  },
  avatar:{
    public_id:{
      type:'String'
    },
    secure_url:{
      type:'String'
    }
  },
  role:{
    type:'String',
    enum:['USER','ADMIN'],
    default:'USER'
  },
  forgotPasswordToken:String,
  forgotPasswordExpiry:Date,
  subscription:{
    id:String,
    status:String
  }
},{
  timestamps:true
});

userSchema.pre('save',async function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods={
  generateJWTToken: 
  async function(){
    return await jwt.sign(
      {
        id:this._id,
        email:this.email,
        subscription:this.subscription,
        role:this.role
      },
      process.env.SECRET,
      {
        expiresIn:'24hr'
      }
    )
  },
  comparePasswrod: 
  async function (plainTextPassword){
    return await bcrypt.compare(plainTextPassword,this.password); 
  },

  generatePasswordResetToken: 
  async function(){
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.forgotPasswordExpiry= Date.now()+15*60*1000; //15 min from now

    return resetToken;
  }
}
const User = model('User',userSchema);

export default User;