import { User } from "../../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";import dotenv from 'dotenv';

dotenv.config();

// Use your actual secret from .env or config
const JWT_SECRET = process.env.JWT_SECRET;

export const userFind = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ error: "User is not verified" });
        }

        const DotVal = user.DotVal;
        const combinedPassword = password + DotVal;

        const isMatch = await bcrypt.compare(combinedPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
           { isActive: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }

        // Encrypt the user's ID using JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        // const decoded = jwt.verify(token, JWT_SECRET);
        return res.status(200).json({ token,role:user.role });

    } catch (error) {
        return res.status(500).json({ error: "Server error", details: error.message });
    }
};
