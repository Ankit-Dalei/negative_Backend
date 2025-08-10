import { User } from "../../Models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyUser = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.body.userId;
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization token missing or invalid" });
        }

        const token = authHeader

        // Decode token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        const userId = decoded.userId;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ error: "User is not verified" });
        }

        // Attach user to request for later use
        req.user = user._id;

        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server error", details: error.message });
    }
};
