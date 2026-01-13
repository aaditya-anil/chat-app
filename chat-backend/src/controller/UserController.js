import { json } from "express";
import userModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

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

        const token = jwt.sign(
            { id: user._id, userName: user.userName },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        return res.status(200).json({
            message: "user authenticated...",
            token: token,
            userName: userName
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error
        })
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