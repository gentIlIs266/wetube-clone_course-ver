import User from "../models/User"; 
import bcrypt from "bcrypt";

export const getUserJoin = (req, res) => {
    res.render("user-join", { pageTitle: "USER JOIN", tabTitle: "user join"});
}
export const postUserJoin = async (req, res) => {
    const { name, username, password1, password2, email, location } = req.body;
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (password1 !== password2) {
        return res.status(400).render("user-join", {
            pageTitle: "USER JOIN", tabTitle: "user join", errMessage: "Password confirmation does not match."
        });
    }
    if (exists) {
        return res.status(400).render("user-join", {
            pageTitle: "USER JOIN", tabTitle: "user join", errMessage: "This username already exists."
        });
    }
    try{   
        await User.create({
            name,
            username,
            password,
            email,
            location
        });
        return res.redirect("/login");
    } catch (error) {
        res.status(400).render("user-join", {
            pageTitle: "USER JOIN", 
            tabTitle: "user join", 
            errMessage: error._message
        })
    }
}
export const getUserLogIn = (req, res) => {
    return res.render("user-login", { pageTitle: "USER LOGIN", tabTitle: "user login"});
}
export const postUserLogIn = async (req, res) => {
    const { username, password } = req.body;
    const findUser = await User.findOne({ username })
    if (!findUser) {
        return res.status(400).render("user-login", {
            pageTitle: "USER LOGIN",
            tabTitle: "user login",
            errMessage: "An Account with this username does not exists."
        });
    }
    const passwordOk = await bcrypt.compare(password, findUser.password);
    if (!passwordOk) {
        return res.status(400).render("user-login", {
            pageTitle: "USER LOGIN",
            tabTitle: "user login",
            errMessage: "Wrong Password"
        });
    }
    return res.redirect("/");
}

export const seeUser = (req, res) => {
    res.send("see user profile");
}
export const userLogOut = (req, res) => {
    res.send("user logout");
}
export const editUser = (req, res) => {
    res.send("edit user");
}
export const deleteUser = (req, res) => {
    res.send("delete user");
}
