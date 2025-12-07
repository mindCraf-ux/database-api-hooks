import mongoose, {Schema} from "mongoose";

import mongooseAggreatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
videoFile:{
    type: String,  //cloudinary url
    required: true
},

thumbnail:{
    type: String,  //cloudinary url
    required: true
},

title:{ 
type: String,
required: true
},

description:{
    type: String,
    required: true
},

duration: {
  type: Number, //cloudnary url
  required: true
},

views:{
  type: Number,
  default: 0
},

isPublished:{
  type: Boolean,
  default: true
},

owner:{
  type: Schema.Types.ObjectId,
  ref: "User",
  required: true
}
}, 
{
timestamps:true
}
)


videoSchema.plugin(mongooseAggreatePaginate);
//model creation
//plugin is a type of hook (you can say middlewear)that allows us to add functionality to our schema 

export const Video = mongoose.model("Video", videoSchema);