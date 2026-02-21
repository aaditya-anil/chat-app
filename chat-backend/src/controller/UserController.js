import { json } from "express";
import userModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { generateAccessToken, generateRefreshToken } from "../services/TokenService.js";
import refreshTokenModel from "../models/RefreshTokenModel.js";

dotenv.config();

export const logoutUser = async (req, res) => {
    try {
        const userId = req.userId;

        await refreshTokenModel.deleteMany({
            userId: userId
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
        const user = await userModel.findOne({ userName: userName });

        if (user != null) {
            return res.status(200).json({
                user: user.userName
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