import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String },
        email: { type: String, required: true, unique: true },
        location: String,
        socialOnly: { type: Boolean, default: false },
        avatarUrl: { type: String }
    }
)

userSchema.pre("save", function () {
    this.password = bcrypt.hash(this.password, 5);
});

const userModel = mongoose.model("User", userSchema);

export default userModel;