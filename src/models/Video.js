import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        hashtags: [{ type: String }],
        createdAt: { type: Date, required: true, default: Date.now },
        meta: {
            views: { type: Number, default: 0 },
            rating: { type: Number, default: 0 },
        } 
    }
);

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;