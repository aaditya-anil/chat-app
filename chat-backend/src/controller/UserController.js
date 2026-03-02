import userModel from "../models/UserModel.js";
import dotenv from "dotenv"
import refreshTokenModel from "../models/RefreshTokenModel.js";

dotenv.config();

export const logoutUser = async (req, res) => {
    try {
        const userId = req.userId;

        await refreshTokenModel.deleteMany({
            userid: userId
        })

        res.clearCookie('refreshToken');

        res.status(204).send();
    } catch (error) {
        res.status(500);
    }
}


export const getUser = async (req, res) => {
    try {
        const { userName } = req.query;
        const users = await userModel.find({ userName: { $regex: userName, $options: "i" } });
        const userNames = users.map(x => x.userName);

        if (userNames != null) {
            return res.status(200).json({
                user: userNames
            })
        }
        else {
            return res.status(404).json({
                message: 'User not found'
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        })
    }
}