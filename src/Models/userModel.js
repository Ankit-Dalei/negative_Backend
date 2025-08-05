import { MongoClient } from 'mongodb';
import { UserSchema } from '../Schemas/userTables.js';

export const User = MongoClient.model('User', UserSchema);