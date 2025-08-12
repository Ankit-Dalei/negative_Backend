import { UserMainModel } from "../../Models/userCloudMainModel.js";
import { driveStoreTables } from "../../Schemas/driveStoreTables.js";
import mongoose from 'mongoose';


export const getMainCloudTable = async (req, res) => {
    const userId  = req.user;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const collectionName = String(userId);
        
        const data = await UserMainModel(collectionName).find();
        return res.status(200).json({
            message: "Data fetched successfully",
            data
        });

    } catch (error) {
        return res.status(500).json({ error: "Server error", details: error.message });
    }
};
