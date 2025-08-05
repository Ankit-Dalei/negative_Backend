import { User } from "../../Models/userModel.js";
import { generateRandomString } from "../generator/generateRandomString.js";
import bcrypt from 'bcryptjs';

export const userStroe = async (req, res, next) => {
    let { password, username, email, lastName, firstName, avatar, role, isVerified, isActive } = req.body;

    // Add random salt to password
    const genVal=generateRandomString()
    const rawPassword = password + '.' + genVal ;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);
        const newUser = new User({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            DotVal:`.${genVal}`,
            role,
            avatar,
            isVerified,
            isActive
        });

        await newUser.save();
        const user = await User.findOne({ username });

        req.createdUser = user;
        next();
        return res.status(200).json({ msg: "success" });
    } catch (err) {
        return res.status(500).send({ error: "Failed to create user", details: err.message });
    }
};
