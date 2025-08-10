import mongoose from 'mongoose';
import { driveStoreTables } from '../Schemas/driveStoreTables.js';

export const UserMainModel = (collectionName)=>{
    return mongoose.model(collectionName, driveStoreTables, collectionName)
};
