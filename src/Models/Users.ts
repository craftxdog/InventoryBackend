import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  userName: string
  email: string
  password: string
  confirmed: boolean
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  confirmed: {
    type: Boolean,
    default: false
  }
}, {timestamps: true})

const User = mongoose.model<IUser>('User', userSchema)
export default User
