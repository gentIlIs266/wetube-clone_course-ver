import express from "express";

import { recommendedVideos, searchVideos } from "../controllers/videoController";
import { getUserJoin, postUserJoin, getUserLogIn, postUserLogIn } from "../controllers/userController";
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", recommendedVideos);

rootRouter
    .route("/join")
    .all(publicOnlyMiddleware)
    .get(getUserJoin)
    .post(postUserJoin);
    
rootRouter
    .route("/login")
    .all(publicOnlyMiddleware)
    .get(getUserLogIn)
    .post(postUserLogIn);

rootRouter.get("/search", searchVideos);

export default rootRouter; 