import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import config from "./config/config.js";
import userRouter from './routes/users.js'
import authRouter from './routes/auth.js'

const app = express();

app.use(express.json())
app.use(helmet());
app.use(morgan("common"))

app.get("/", (req,res)=>{
    res.send("Server Runing")
})

app.use('/api/users', userRouter);
app.use('/api/auth' , authRouter)

app.listen(config.Port, () => {
  console.log("Server Running " + config.Port);
});

mongoose
  .connect(config.MongoUrl)
  .then(() => {
    console.log("MongoDB Successfully Connected");
  })
  .catch((err) => console.log(err));
