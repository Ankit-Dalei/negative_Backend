import { User } from "../../Models/userModel.js";

export const userStroe=async (req,res,next)=>{
    const { password, username, email, lastName, firstName,avatar,role,isVerified,isActive } = req.body;

        const newUser = new User({
            firstName,
            lastName,
            email,
            username,
            password,
            role,
        });

        try {
            await newUser.save();
            const user = await User.findOne({ username });
            req.createdUser = user;
            next()
            return res.status(200).json({ msg: "success" });
        } catch (err) {
            return res.status(500).send({ error: "Failed to create user", details: err.message });
        }
}