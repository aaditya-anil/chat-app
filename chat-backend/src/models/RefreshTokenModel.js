import mongoose, { Schema } from "mongoose";

const refreshTokenSchema = new Schema({
    userid: { type: String },
    refreshToken: { type: String }
})

const refreshTokenModel = mongoose.model("refreshToken", refreshTokenSchema);
export default refreshTokenModel;