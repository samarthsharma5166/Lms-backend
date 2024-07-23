import mongoose from "mongoose";
mongoose.set('strictQuery',false);
const connctionToDb=async()=>{
  mongoose.connect(
    await process.env.MONGO_URI || `mongodb://127.0.0.1:27017/LMS `
  ).then((conn)=>console.log(`connected to mongodb database ${conn.connection.host}`))
  .catch((error)=>{console.log(error); process.exit(1);})
}

export default connctionToDb;