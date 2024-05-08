import express from "express";

import {
    seeUser,
    userLogOut,
    getEditUser,
    postEditUser,
    deleteUser,
    startGithubLogin,
    finishGithubLogin,
    getChangePassword,
    postChangePassword,
} from "../controllers/userController";
import { protectUrlMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get(":id", seeUser);
userRouter.get("/logout", protectUrlMiddleware, userLogOut);
userRouter
    .route("/edit")
    .all(protectUrlMiddleware)
    .get(getEditUser)
    .post(postEditUser);
userRouter
    .all(protectUrlMiddleware)
    .route("/change-password")
    .get(getChangePassword)
    .post(postChangePassword);
userRouter.get("/delete", deleteUser);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);    
export default userRouter; 