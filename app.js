import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import courseRoutes from './routes/course.router.js'
const app = express();


// Middleware
app.use(express.json());
// app.use(cors({
//   origin:[],
//   crdentials:true
// }))
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"));

// Routes
app.use('/ping',(req,res)=>{
  res.send('Poong');
});
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/course",courseRoutes);
app.all('*',(req,res)=>{
  res.status(404).send("oops! page not found ");
});
app.use(errorMiddleware);
export default app;