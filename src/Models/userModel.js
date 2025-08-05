import mongoose from 'mongoose';
import { UserSchema } from '../Schemas/userTables.js';

export const User = mongoose.model('User', UserSchema);