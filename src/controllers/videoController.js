let videos = [
    {
        title: "okitegami",
        writer: "vaundy",
        views:  9173936,
        createdAt: "1 years ago",
        id: 1
    },
    {
        title: "odoriko",
        writer: "vaundy",
        views: 84247827,
        createdAt: "2 years ago",
        id: 2
    },
    {
        title: "koikaze ni nosete",
        writer: "vaundy",
        views: 21624066,
        createdAt: "2 years ago",
        id: 3
    }
];

export const recommendedVideos = (req, res) => {
    return res.render("home", {pageTitle: "Home", videos});
}
export const searchVideos = (req, res) => {
    res.send("search videos");
}

export const watchVideo = (req, res) => {
    const videoId = req.params.id;
    const selectedVideo = videos[videoId - 1];
    return res.render("watch-video", {tabTitle: selectedVideo.title, pageTitle: `Watch ${selectedVideo.title}`, selectedVideo});
}
export const editVideo = (req, res) => {
    const videoId = req.params.id;
    const selectedVideo = videos[videoId - 1];
    res.render("edit-video", {pageTitle: `Edit ${selectedVideo.title}`});
}
export const deleteVideo = (req, res) => {
    res.send("delete video");
}
export const uploadVideo = (req, res) => {
    res.send("upload video");
}