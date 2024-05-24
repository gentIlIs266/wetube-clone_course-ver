import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        fileUrl: { type: String, required: true },
        title: { type: String, required: true, trim: true, maxLength: 100 },
        description: { type: String, required: true, trim: true, maxLength: 5000 },
        hashtags: [{ type: String, trim:true }],
        createdAt: { type: Date, required: true, default: Date.now },
        meta: {
            views: { type: Number, default: 0 },
            rating: { type: Number, default: 0 },
        },
        owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
    }
);

videoSchema.static("formatHashtags", function (hashtags) {
    return hashtags
        .split(",")
        .map((word)=>(word.startsWith("#") ? word : `#${word}`));
})

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;