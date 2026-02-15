import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401);
        }

        const token = authHeader.split(' ')[1];

        const payload = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        req.userId = payload.userId;

        next();

    } catch (error) {
        return res(500);
    }
}