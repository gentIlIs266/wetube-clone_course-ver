import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        title: String,
        author: String,
        description: String,
        createdAt: Number,
        hashtags: [{ type: String }],
        meta: {
            views: Number,
            rating: Number,
        } 
    }
);

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;