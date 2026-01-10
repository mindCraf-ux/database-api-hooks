import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';

import {User} from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export {uploadOnCloudinary} from '../utils/cloudinary.js';
const registerUser = asyncHandler(async (req, res)=>{
  /*res.status(200).json({
    message:"Oh fxck yeaahh!! User registered successfully",
  })*/

    //get user detail from user request body (from fronntend)
    //validation - not empty
    //check user already exist: username, email
    //check for images, avatar
    //create user object- create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return result

    const {fullName, email, username, password}= req.body
    //console.log("email: ", email);


    /*if(fullName ===""){
      throw new ApiError
      OR*/

if(
  [fullName, email, username, password].some((field) => field?.trim() === "" )
){
  throw new ApiError(400, "All fields are required")
}
 
const existedUser= await User.findOne({
  $or: [{username}, {email}]
})

if (existedUser){
throw new ApiError(409, "User with given username or email already exist")
}

console.log("req.files: ", req.files);


if (!req.files || !req.files.avatar || req.files.avatar.length === 0) {
  throw new ApiError(400, "Avatar image is required")
}

const avatarLocalPath = req.files.avatar[0].path;
//const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
  coverImageLocalPath = req.files.coverImage[0].path
}


if (!avatarLocalPath){
  throw new ApiError(400, "Avatar image is required")
}

const avatar= await uploadOnCloudinary(avatarLocalPath);
const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

if(!avatar){
  throw new ApiError (500, "Unable to upload avatar image, please try again later")
}

const user = await User.create({
  fullName,
  avatar: avatar?.url || "" ,
  coverImage: coverImage?.url || "",
  email,
  password,
  username: username.toLowerCase()
})

const createdUser=await User.findById(user._id).select(
  "-password -refreshToken"


)

  if(!createdUser){
    throw new ApiError(500, "Failed to create user")
  }

return res.status(201).json(
new ApiResponse(201, createdUser, "user registered successfully")
)

})

export {registerUser}; 