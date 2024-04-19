export const recommendedVideos = (req, res) => {
    res.send("home page videos");
}
export const searchVideos = (req, res) => {
    res.send("search videos");
}

export const seeVideo = (req, res) => {
    console.log(`the user is trying to watch video #${req.params.id}`);
    return res.send(`watch video No.${req.params.id}`);
}
export const editVideo = (req, res) => {
    res.send("edit video");
}
export const deleteVideo = (req, res) => {
    res.send("delete video");
}
export const uploadVideo = (req, res) => {
    res.send("upload video");
}