import mongoose, { Schema } from 'mongoose';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const userSchema = new Schema({
  username:{
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true

  },

  email:{
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  fullname:{
    type: String,
    trim: true,
    required: true,
    index: true
  },

  avatar:{
    type: String, //using cloudinary for image hosting
    default: null,
    require: true
  },

  coverImage:{
    type: String,
  },
//watch history is an array of video ids because we need to keep track of multiple videos watched by the user
  watchHistory:[
    {
    type: Schema.Types.ObjectId,
    ref: "Video"
  }
],

password:{
    type: String,
    required: [true, 'Password is required']    //password will be compulsary with a custom error message "Password is required"
  },

  refreshToken:{
    type: String,
    default: null
  }

},
{ timestamps: true } //createdAt and updatedAt fields will be added automatically

)


userSchema.pre("save" , async function (next) {
  if(!this.isModified("password")) return next();

  this.password = bcrypt.hashSync(this.password, 10);
  next();
})

userSchema.methods.isPasswordCorrect = async function(password){
return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {

  return jwt.sign(
    {
_id: this._id,
email: this.email,
username: this.username,
fullname: this.fullname
},
process.env.ACCESS_TOKEN_SECRET,
{ expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  )
}


userSchema.methods.generateRefreshToken = function() {
   return jwt.sign(
    {
_id: this._id,

},
process.env.REFRESH_TOKEN_SECRET,
{ expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  )
}

export const User = mongoose.model("User", userSchema);