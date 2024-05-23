import express from "express";

import { watchVideo, getEdit, postEdit, deleteVideo, getUploadVideo, postUploadVideo } from "../controllers/videoController";
import { protectUrlMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watchVideo);
videoRouter
    .route("/:id([0-9a-f]{24})/edit")
    .all(protectUrlMiddleware)
    .get(getEdit)
    .post(postEdit);
videoRouter
    .route("/:id([0-9a-f]{24})/delete")
    .all(protectUrlMiddleware)
    .get(deleteVideo);
videoRouter
    .route("/upload")
    .all(protectUrlMiddleware)
    .get(getUploadVideo)
    .post(videoUpload.single("video"), postUploadVideo);

export default videoRouter; 
