import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, require: true },
    userName: { type: String, require: true, unique: true },
    password: { type: String, require: true }
});

const userModel = mongoose.model('User', userSchema);

export default userModel;