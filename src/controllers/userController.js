import User from "../models/User"; 
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getUserJoin = (req, res) => {
    res.render("users/user-join", { pageTitle: "USER JOIN", tabTitle: "user join"});
}
export const postUserJoin = async (req, res) => {
    const { name, username, password1, password2, email, location } = req.body;
    if (password1 !== password2) {
        return res.status(400).render("users/user-join", {
            pageTitle: "USER JOIN",
            tabTitle: "user join",
            errMessage: "Password confirmation does not match."
        });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
        return res.status(400).render("users/user-join", {
            pageTitle: "USER JOIN",
            tabTitle: "user join",
            errMessage: "This username or email already exists."
        });
    }
    try{   
        await User.create({
            name,
            username,
            password1,
            email,
            location
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("users/user-join", {
            pageTitle: "USER JOIN", 
            tabTitle: "user join", 
            errMessage: error._message
        });
    }
};
export const getUserLogIn = (req, res) => {
    return res.render("users/user-login", { pageTitle: "USER LOGIN", tabTitle: "user login"});
}
export const postUserLogIn = async (req, res) => {
    const { username, password } = req.body;
    const findUser = await User.findOne({ username, socialOnly:false })
    if (!findUser) {
        return res.status(400).render("users/user-login", {
            pageTitle: "USER LOGIN",
            tabTitle: "user login",
            errMessage: "An Account with this username does not exists."
        });
    }
    const passwordOk = await bcrypt.compare(password, findUser.password);
    if (!passwordOk) {
        return res.status(400).render("users/user-login", {
            pageTitle: "USER LOGIN",
            tabTitle: "user login",
            errMessage: "Wrong Password"
        });
    }
    req.session.loggedIn = true;
    req.session.user = findUser;
    return res.redirect("/");
}

export const seeUser = (req, res) => {
    res.send("see user profile");
}
export const userLogOut = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
}
export const getEditUser = (req, res) => {
    res.render("users/edit-user-profile");
}
export const postEditUser = async (req, res) => {
    const {
        session: {
            user: { _id }
        },
        body: { name, username, email, location },
    } = req;
    const updatedUser = await User.findByIdAndUpdate(_id, {
            name,
            username,
            email,
            location
        },
        { new: true }, 
    ); req.session.user = updatedUser;
    return res.redirect("/users/edit");
}
export const deleteUser = (req, res) => {
    res.send("delete user");
}
export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize"; 
    const startGhLoginConfig = {
        client_id: process.env.GITHUB_CLIENT_ID,
        allow_signup: false,
        scope: "read:user user:email"
    }
    const params = new URLSearchParams(startGhLoginConfig).toString();
    const getGhUrl = `${baseUrl}?${params}`; 
    return res.redirect(getGhUrl);
}
export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const finishGhConfig = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(finishGhConfig).toString();
    const postGhUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(postGhUrl, {
            method: "POST",
            headers: {
                Accept: "application/json"
            }
        })
    ).json();
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const ghApiUrl = "https://api.github.com"; 
        const userData = await (
            await fetch(`${ghApiUrl}/user`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
        ).json();
        const emailData = await (
            await fetch(`${ghApiUrl}/user/emails`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
        ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if (!emailObj) { return res.redirect("/login"); }
        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            const user = await User.create({    
                name: userData.name,
                username: userData.login,
                password: "",
                email: emailObj.email,
                location: userData.location,
                socialOnly: true,
                avatarUrl: userData.avatar_url,
            });
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
}
export const getChangePassword = (req, res) => {
    return res.render("users/change-password", { pageTitle: "CHANGE PASSWORD", tabTitle: "change password" });
}
export const postChangePassword = (req, res) => {
    return res.redirect("/");
}
