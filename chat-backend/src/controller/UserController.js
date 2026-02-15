import { json } from "express";
import userModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { generateAccessToken, generateRefreshToken } from "../services/TokenService.js";
import refreshTokenModel from "../models/RefreshTokenModel.js";

dotenv.config();

export const registerUser = async (req, res) => {
    try {
        const { name, userName, password } = req.body;

        const userExists = await userModel.findOne({ userName });
        if (userExists) {
            return res.status(400).json({
                message: "Username already taken"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await userModel.create({
            name,
            userName,
            password: hashedPassword
        })

        return res.status(200).json({
            message: "User registered successfully",
            userName: userName
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { userName, password } = req.body;

        const userExists = await userModel.findOne({ userName: userName });
        if (!userExists) {
            return res.status(404).json({
                message: "invalid username/password"
            })
        }

        const user = await userModel.find({ userName: userName })
        const isPasswordMatch = await bcrypt.compare(password, user[0].password)

        if (!isPasswordMatch) {
            return res.status(404).json({
                message: "invalid username/password"
            })
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        await refreshTokenModel.create({
            userid: user._id,
            refreshToken: refreshToken
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // in dev, should be changed to secure when deploying
            sameSite: 'strict'
        });

        return res.status(200).json({
            message: "user authenticated...",
            token: accessToken,
            userName: userName
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401);
        }

        const payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const tokenInDB = await refreshTokenModel.findOne({
            userid: payload.userId,
            refreshToken: refreshToken
        })

        if (!tokenInDB) {
            res.status(403);
        }

        const newAccessToken = generateAccessToken(payload.userId);

        res.json({
            accessToken: newAccessToken
        })
    } catch (error) {
        return res.status(500);
    }
}

export const logoutUser = async (req, res) => {
    try {
        const userId = req.userId;

        await refreshTokenModel.deleteMany({
            userId: userId
        })

        res.clearCookie('refreshToken');

        res.status(204);
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