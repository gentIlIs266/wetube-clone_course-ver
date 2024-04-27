import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/wetube");

const db = mongoose.connection;
const handleOpen = () => {
    console.log("[O] Connected to DB");
}
const handleErr = (error) => {
    console.log("[X] DB Error", error);
}

db.on("error", handleErr);
db.once("open", handleOpen);