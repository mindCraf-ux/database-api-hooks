import mongoose, {Schema} from "mongoose";

import mongooseAggreatePaginate from "mongoose-aggregate-paginate-v2";

const connectSchema = new Schema(
  {
    content:{
      type: String,
      required: true
    },
    video:{
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true
    },
    owner:{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    
  },
  {timeStamp: true}

)

commentSchema.plugin(mongooseAggreatePaginate)

const Comment = mongoose.model("Comment", commentSchema)

export default Comment
