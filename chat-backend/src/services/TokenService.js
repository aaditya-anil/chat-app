import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

export const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (userid) => {
    return jwt.sign(
        { userid },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

