import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  coverPicture: {
    type: String,
    default: "",
  },
  followers: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
  iaAdmin: {
    type: Boolean,
    default: false,
  },
  desc:{
    type:String,
    default:""
  },
  city:{
    type:String,
    default:""
  },
  from:{
    type:String,
    default:""
  },
  relationship:{
    type:Number,
    enum:[1,2,3]
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
},
{timestamps:true}
);

const userModel = mongoose.model("User", userSchema)
export default userModel