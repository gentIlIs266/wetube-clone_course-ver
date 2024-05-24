import express from "express";

import {
    seeUserProfile, userLogOut, getEditUser,
    postEditUser, deleteUser, startGithubLogin,
    finishGithubLogin, getChangePassword, postChangePassword,
    
} from "../controllers/userController";
import { protectUrlMiddleware, publicOnlyMiddleware, avatarUpload } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/:id", seeUserProfile);
userRouter.get("/logout", protectUrlMiddleware, userLogOut);

userRouter
    .route("/edit")
    .all(protectUrlMiddleware)
    .get(getEditUser)
    .post(avatarUpload.single("avatar"), postEditUser);
userRouter
    .route("/change-password")
    .all(protectUrlMiddleware)
    .get(getChangePassword)
    .post(postChangePassword);

userRouter.get("/delete", deleteUser);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);    

export default userRouter; 