import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';

import {User} from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

export {uploadOnCloudinary} from '../utils/cloudinary.js';

const generateAccessAndRefereshTokens = async(userId)=>{
  try{
const user = await User.findById(userId)
const accessToken =user.generateAccessToken()
const refreshToken= user.generateRefreshToken()

user.refreshToken = refreshToken
await user.save({validateBeforeSave: false})

return {accessToken, refreshToken}

  }catch(error){
    throw new ApiError(500, "Unable to generate tokens, something went wrong")
  }

}

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


//making login user
/*
req body -> data
username or email
find the user
if not found -> error
compare password
if not match -> error
generate tokens access and refresh token
save refresh token in db
send cookies
return response
*/
const loginUser = asyncHandler(async (req, res)=>{

  const {email, username, password} = req.body || {};
  if(!username && !email){
    throw new ApiError(400, "username or email is required")
  }

  const user = await User.findOne({$or: [{username}, {email}]})

  if(!user){
    throw new ApiError(404, "User not found/exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

   if(!isPasswordValid){
    throw new ApiError(401, "Invalid credentials")
  }

 const {accessToken, refreshToken}= await generateAccessAndRefereshTokens(user._id)


 const loggedInUser =await User.findById(user._id).select("-password -refreshToken")

 const options= {
  httpOnly: true,
  secure: true
 }

 return res.status(200)
 .cookie("accessToken", accessToken, options)
 .cookie("refreshToken", refreshToken, options)
 .json(
  new ApiResponse(200,
    {
      user:loggedInUser, accessToken, refreshToken
    },
    "User logged in successfully"
  )
 )
})

 const logoutUser = asyncHandler(async(req, res) => {
 await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )
 

  const options= {
  httpOnly: true,
  secure: true
 }

 return res
 .status(200)
 .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {

  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
throw new ApiError(401, "unauthorized access, no refresh token")
  }

 try {
  const decodedToken= jwt.verify(
     incomingRefreshToken,
     process.env.REFRESH_TOKEN_SECRET,
   )
 
   const user =await User.findById(decodedToken?._id)
   if (!user) {
 throw new ApiError(401, "invalid refresh token, user not found")
   }
 
 if (incomingRefreshToken !== user?.refreshToken) {
   throw new ApiError(401, "refresh token mismatch, expired")
 }
 
 const option= {
   httpOnly: true,
   secure: true
 }
 
 const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
 
 return res
 .status(200)
 .cookie("accessToken", accessToken, option)
 .cookie("refreshToken", newRefreshToken, option)
 .json(
   new ApiResponse(
     200,
     {accessToken, refreshToken: newRefreshToken},
     "Access token refreshed successfully"
   )
 )
 } catch (error) {
  throw new ApiError(401, error?.message || "Invalid refresh token")
 }
})

export {registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
}; 