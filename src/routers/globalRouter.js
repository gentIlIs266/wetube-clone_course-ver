import express from "express";

import { recommendedVideos, searchVideos } from "../controllers/videoController";
import { userJoin, userLogIn } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", recommendedVideos);
globalRouter.get("/join", userJoin);
globalRouter.get("/login", userLogIn);
globalRouter.get("/search", searchVideos);

export default globalRouter; 