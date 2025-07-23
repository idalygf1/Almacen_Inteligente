import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  role: string;
  phone: string;
  status: boolean;
  createDate: Date;
  deleteDate?: Date;
  roles?: string[]; // ✅ aquí va el arreglo
}


const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  phone: { type: String },
  status: { type: Boolean, default: true },
  createDate: { type: Date, default: Date.now },
  deleteDate: { type: Date },
  roles: {
        type: [String],
        required: true,
        enum: ["admin", "viewer", "editor"],
        default: ["viewer"]
    }
});

export const User = model<IUser>('User', userSchema);
