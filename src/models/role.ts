// models/role.ts
import { Schema, model, Document } from "mongoose";

export interface IRole extends Document {
  tipo: string;
  name: string;
  options: string;
  status: boolean;
  createDate: Date;
  updateDate: Date;
}


const roleSchema = new Schema<IRole>({
  tipo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  options: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
});

export const Role = model<IRole>("Role", roleSchema);