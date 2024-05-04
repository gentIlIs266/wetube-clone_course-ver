import express from "express";

import { seeUser , userLogOut, editUser, deleteUser, startGithubLogin, finishGithubLogin } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get(":id", seeUser);
userRouter.get("/logout", userLogOut);
userRouter.get("/edit", editUser);
userRouter.get("/delete", deleteUser);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

export default userRouter; 