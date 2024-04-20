export const recommendedVideos = (req, res) => {
    const videos = [
        {
            title: "okitegami",
            writer: "vaundy",
            views: 4723189,
            createdAt: "1 years ago"
        },
        {
            title: "odoriko",
            writer: "vaundy",
            views: 534798,
            createdAt: "2 years ago"
        },
        {
            title: "koikaze ni nosete",
            writer: "vaundy",
            views: 809345,
            createdAt: "2 years ago"
        }
    ];
    return res.render("home", {pageTitle: "Home", videos});
}
export const searchVideos = (req, res) => {
    res.send("search videos");
}

export const watchVideo = (req, res) => {
    console.log(`The user is trying to watch video #${req.params.id}`);
    res.render("watch-video", {pageTitle: "Watch Video"});
}
export const editVideo = (req, res) => {
    res.render("edit-video", {pageTitle: "Edit Video"});
}
export const deleteVideo = (req, res) => {
    res.send("delete video");
}
export const uploadVideo = (req, res) => {
    res.send("upload video");
}