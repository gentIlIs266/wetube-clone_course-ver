import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    return next();
}
export const protectUrlMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/login");
    }
}
export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/")
    }
}

export const uploadFiles = multer({ dest: "uploads/" });
export const avatarUpload = multer({
    dest: "uploads/avatars/",
    limits: {
        fileSize: 16000000
    }
})
export const videoUpload = multer({
    dest: "uploads/videos/",
    limits: {
        fileSize: 256000000
    }
})