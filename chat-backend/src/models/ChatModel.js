import mongoose, { model, Schema } from "mongoose";

const chatSchema = new Schema({
    message: { type: String },
    senderId: { type: String },
    receiverId: { type: String }
}, {
    timestamps: true
})

const chatModel = mongoose.model("chat", chatSchema);
export default chatModel;