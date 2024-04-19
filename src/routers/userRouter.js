import express from "express";

import { seeUser , userLogOut, editUser, deleteUser } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get(":id", seeUser);
userRouter.get("/logout", userLogOut);
userRouter.get("/edit", editUser);
userRouter.get("/delete", deleteUser);

export default userRouter; 