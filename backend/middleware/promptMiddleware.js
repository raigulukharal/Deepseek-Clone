import jwt from 'jsonwebtoken';

const userMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization; 
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(404).json({ message: "Token is not found in Prompt middleware" });
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.userId = decoded.id;

        next();
    } catch (error) {
        return res.status(402).json({
            message: "Invalid Token or Expired",
            success: false
        });
    }
};

export default userMiddleware;