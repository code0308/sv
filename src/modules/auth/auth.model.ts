import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpires?: Date;
  refreshToken?: string;
  role: 'user' | 'admin'; 
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpires: Date,
  refreshToken: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user', required: true },
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
