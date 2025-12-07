import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/ChatApp');
        console.log("Connection to DB successfull");
    } catch (error) {
        console.error("Unable to connect to MongoDB" + error);
        process.exit(1);
    }
}

export default connectDB;