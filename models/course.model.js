import {model,Schema} from 'mongoose';
const couseSchema = new Schema({
  title:{
    type:String,
    required:[true,'title is required'],
    minLength:[8,'Title should have minimum 5 charcters'],
    maxLength:[60,'Title should be less than 60 words']
  },
  description:{
    type:String,
    required:[true,'Description is required'],
    minLength:[5,'Title should have minimum 5 charcters'],
    maxLength:[200,'Title should be less than 200 words']
  },
  category:{
    type:String,
    required:[true,'Category is required'],
  },
  thumbnail:{
    public_id:{
      type:String,
      required:true
    },
    secure_url:{
      type:String,
      required:true
    }
  },
  lecutres:[
    {
      title:String,
      description:String,
      lecture:{
        public_id:{
          type:String,
          required:true
        },
        secure_url:{
          type:String,
          required:true
        }
      }
    }
  ],
  numberOfLecutres:{
    type:Number,
    default:0 
  },
  createdBy:{
    type:String
  }
},{
  timestamps:true
})

const Course = model('Course',couseSchema);

export default Course;
