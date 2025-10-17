import { User } from "../../Models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const getUserData = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const userId  = req.user;
        if (!userId) {
            return res.status(401).json({ error: "Authorization token missing or invalid" });
        }



        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ error: "User is not verified" });
        }
        
        // Prepare user data to send
        const userData = {
            name: user.firstName + " " + user.lastName,
            email: user.email,
            createdAt: user.createdAt,
        };  

        return res.status(200).json({
            message: "User data fetched successfully",
            userData
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server error", details: error.message });
    }
};
