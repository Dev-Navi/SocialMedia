import express from "express";
import User from "../models/User.js";
import bcrypt from 'bcrypt'
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10)
    const hashpassword = await bcrypt.hash(password, salt)
    const newUser = new User({
        username,
        password:hashpassword,
        email,
      });
    const user = await newUser.save();
    res.status(200).json({user:user})
  } catch (err) {
    console.log(err);
    res.status(500).json({error:"Some error on server"})
  }
});

router.post("/login", async (req,res)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email:email})
        console.log(user,'u');
        if(!user) {
            res.status(400).json({error:"User Not Found"})
        }

        const validatePassword = await bcrypt.compare(password, user.password);
        if(!validatePassword) {
            res.status(400).json({error:"Password Not Valid"})
        }

        res.status(200).json({msg:"Login Success", user:user})
    } catch (err) { 
        console.log(err);
        res.status(500).json({error:"Some error on server"})
    }
})

export default router;
