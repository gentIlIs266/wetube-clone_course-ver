import User from "../models/User"; 
import Video from "../models/Video"; 
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
    const passwordOk = await bcrypt.compare(password, findUser.password);
    if (!passwordOk) {
        return res.status(400).render("users/user-login", {
            pageTitle: "USER LOGIN",
            tabTitle: "user login",
            errMessage: "Wrong Password"
        });
    }
    if (!findUser) {
        return res.status(400).render("users/user-login", {
            pageTitle: "USER LOGIN",
            tabTitle: "user login",
            errMessage: "An Account with this username does not exists."
        });
    }
    req.session.loggedIn = true;
    req.session.user = findUser;
    return res.redirect("/");
}

export const seeUserProfile = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path:"videos",
        populate:[
            { path: "owner" }
        ]
    });
    if (!user) {
        return res.status(404).render("404");
    }
    return res.render("users/user-profile", {
        pageTitle: `${user.name}'s PROFILE`,
        tabTitle: "user profile",
        user,
    })
}
export const userLogOut = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
}
export const getEditUser = (req, res) => {
    res.render("users/edit-user-profile", {
        pageTitle: "EDIT PROFILE",
        tabTitle: "edit profile"
    });
}
export const postEditUser = async (req, res) => {
    const {
        session: {
            user: { _id, avatarUrl }
        },
        body: { name, username, email, location },
        file
    } = req;
    const modifiedChecker = async (username, email) => {
        try {
            const findByElement = await User.findOne({ $or: [{ username }, { email }] })
            if (typeof(findByElement) === Object) {
                return res.status(400).render("users/edit-user-profile", {
                    pageTitle: "EDIT PROFILE",
                    tabTitle: "edit profile",
                    errMessage: "There is already a user with the username or email you are trying to change."
                })
            }
        } catch (error) {
            return res.status(400).render("users/edit-user-profile", {
                pageTitle: "EDIT PROFILE",
                tabTitle: "edit profile",
                errMessage: "There was a problem trying to find if there is already a user using the username or email you are trying to use."
            })
        }
    }; modifiedChecker(username, email);
    const updatedUser = await User.findByIdAndUpdate(_id, {
            name,
            username,
            email,
            location,
            avatarUrl: file ? file.path : avatarUrl
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
    if (req.session.user.socialOnly === true) {
        return res.redirect("/");
    } 
    return res.render("users/change-password", { pageTitle: "CHANGE PASSWORD", tabTitle: "change password" });
}
export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: { _id }
        },
        body: { oldPassword, newPassword, newPasswordConfirm },
    } = req;
    const user = await User.findById(_id);
    const passwordOk = await bcrypt.compare(oldPassword, user.password);
    if (!passwordOk) {
        return res.status(400).render("users/change-password", {
            pageTitle: "CHANGE PASSWORD",
            tabTitle: "change password",
            errMessage: "the current password is incorrect"
        });
    }
    if (newPassword !== newPasswordConfirm) {
        return res.status(400).render("users/change-password", {
            pageTitle: "CHANGE PASSWORD",
            tabTitle: "change password",
            errMessage: "new password and password confirmation is not the same"
        });
    }
    user.password = newPassword;
    await user.save();
    return res.redirect("/users/logout");
}
