import mongoose, { Schema, model, Document } from "mongoose";

export interface IMenu extends Document {
  title: string;
  path: string;
  icon: string;
  role: string;
}

const menuSchema = new Schema<IMenu>({
  title: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  role: {
    type: String,
  },
});

export default model<IMenu>("Menu", menuSchema);
