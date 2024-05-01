import Video from "../models/Video"; 

export const recommendedVideos = async (req, res) => {
    const dbVideos = await Video.find({})
    return res.render("home", {pageTitle: "Home", tabTitle: "wetube", dbVideos});
};
export const searchVideos = async (req, res) => {
    const { searchword } = req.query;
    let searchedVideos = [];
    if (searchword) {
        searchedVideos = await Video.find({
            title: {
                $regex: new RegExp(searchword, "i") 
            }
        })
    }
    return res.render("search-video", { pageTitle: "Search Video", tabTitle: "Search", searchedVideos, searchword });
}

export const watchVideo = async (req, res) => {
    const videoId = req.params.id;
    const dbVideo = await Video.findById(videoId);
    if (dbVideo === null) {
        return res.render("404");    
    }
    return res.render("watch-video", { pageTitle: `Watch ${dbVideo.title}`, tabTitle: dbVideo.title, dbVideo});
}
export const getEdit = async (req, res) => {
    const videoId = req.params.id;
    const dbVideo = await Video.findById(videoId);
    if (dbVideo === null) {
        return res.render("404");
    }
    return res.render("edit-video", {pageTitle: `Edit ${dbVideo.title}`, tabTitle: `${dbVideo.title} - Editing`, dbVideo});
}
export const postEdit = async (req, res) => {
    const videoId = req.params.id;
    const isDbVideoExists = await Video.exists({ _id: videoId });
    const { title, hashtags, description } = req.body;
    if (isDbVideoExists === false) {
        return res.render("404");
    }
    await Video.findByIdAndUpdate(videoId, {  
        title,
        description,
        hashtags: Video.formatHashtags(hashtags)
    })
    return res.redirect(`/videos/${videoId}`);
}
export const deleteVideo = async (req, res) => {
    const { id } = req.params; 
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}
export const getUploadVideo = (req, res) => {
    res.render("upload-video", {pageTitle: "UPLOAD VIDEO", tabTitle: "Upload Video"});
}
export const postUploadVideo = async (req, res) => {
    const { title, description, hashtags } = req.body;
    try {
        await Video.create({
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
            createdAt: Date.now(),
        });
        return res.redirect("/");
    } catch(error) {
        res.render("upload-video", {
            pageTitle: "UPLOAD VIDEO",
            tabTitle: "Upload Video",
            errMessage: error._message
        });
    }
}