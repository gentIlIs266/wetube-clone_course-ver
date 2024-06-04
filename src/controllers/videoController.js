import Video from "../models/Video"; 
import User from "../models/User"; 

export const recommendedVideos = async (req, res) => {
    const dbVideos = await Video.find({})
        .sort({ createdAt: "desc" })
        .populate("owner")
    return res.render("home", {
        pageTitle: "Home",
        tabTitle: "wetube",
        dbVideos
    });
};
export const searchVideos = async (req, res) => {
    const { search_query } = req.query;
    let searchedVideos = [];
    if (search_query) {
        searchedVideos = await Video.find({
            title: {
                $regex: new RegExp(search_query, "i") 
            }
        }).populate("owner")
    }
    return res.render("videos/search-video", {
        pageTitle: "Search Video",
        tabTitle: "Search",
        searchedVideos,
        search_query
    });
}

export const watchVideo = async (req, res) => {
    const videoId = req.params.id;
    const dbVideo = await Video.findById(videoId).populate("owner");
    if (dbVideo === null) {
        return res.status(404).render("404");    
    }
    return res.render("videos/watch-video", {
        pageTitle: `Watch ${dbVideo.title}`,
        tabTitle: dbVideo.title,
        dbVideo,
    });
}
export const getEdit = async (req, res) => {
    const videoId = req.params.id;
    const dbVideo = await Video.findById(videoId);
    if (!dbVideo) {
        return res.status(404).render("404");
    }
    if (String(dbVideo.owner) !== String(req.session.user._id)) {
        return res.status(403).redirect("/");
    }
    return res.render("videos/edit-video", {
        pageTitle: `Edit ${dbVideo.title}`,
        tabTitle: `Edit ${dbVideo.title}`,
        dbVideo
    });
}
export const postEdit = async (req, res) => {
    const videoId = req.params.id;
    const isDbVideoExists = await Video.exists({ _id: videoId });
    const video = await Video.findById(videoId);
    const { title, hashtags, description } = req.body;
    if (!isDbVideoExists) {
        return res.render("404");
    }
    if (String(video.owner) !== String(req.session.user._id)) {
        return res.status(403).redirect("/");
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
    const dbVideo = await Video.findById(id);
    if (!dbVideo) {
        return res.status(404).render("404");
    }
    if (String(dbVideo.owner) !== String(req.session.user._id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}
export const getUploadVideo = (req, res) => {
    res.render("videos/upload-video", { pageTitle: "UPLOAD VIDEO", tabTitle: "Upload Video" });
}
export const postUploadVideo = async (req, res) => {
    const {
        session: {
            user: { _id }
        }, 
        body: { title, description, hashtags },
        file: { path: fileUrl }
    } = req;
    try {
        const newVideo = await Video.create({
            fileUrl: fileUrl,
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
            createdAt: Date.now(),
            owner: _id
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch(error) {
        res.status(400).render("videos/upload-video", {
            pageTitle: "UPLOAD VIDEO",
            tabTitle: "Upload Video",
            errMessage: error._message
        });
    }
}
