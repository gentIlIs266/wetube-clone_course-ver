import Video from "../models/Video"; 

export const recommendedVideos = async (req, res) => {
    const videos = await Video.find({})
    return res.render("home", {pageTitle: "Home", videos});
};
export const searchVideos = (req, res) => {
    res.send("search videos");
}

export const watchVideo = (req, res) => {
    const videoId = Video._id;
    return res.render("watch-video", { pageTitle: `Watch ` });
}
export const getEdit = (req, res) => {
    const videoId = req.params.id;
    res.render("edit-video", {pageTitle: `Edit`});
}
export const postEdit = (req, res) => {
    const videoId = req.params.id;
    const editedTitle = req.body;
    return res.redirect(`/videos/${videoId}`);
}
export const deleteVideo = (req, res) => {
    res.send("delete video");
}
export const getUploadVideo = (req, res) => {
    res.render("upload-video", {pageTitle: "UPLOAD VIDEO", tabTitle: "Upload Video"});
}
export const postUploadVideo = async (req, res) => {
    const { title, writer, description, hashtags } = req.body;
    try {
        await Video.create({
            title,
            description,
            hashtags: hashtags.split(",").map((word) => `#${word}`),
            createdAt: Date.now(),
        });
        return res.redirect("/");
    } catch(error) {
        res.render("upload-video", {pageTitle: "UPLOAD VIDEO", tabTitle: "Upload Video", errMessage: error._message});
    }
}