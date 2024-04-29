import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        title: String,
        author: String,
        description: String,
        hashtags: [{ type: String }],
        meta: {
            createdAt: Number,
            views: Number,
            rating: Number,
        } 
    }
);

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;