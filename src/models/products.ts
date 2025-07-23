import { Schema, model, Document } from "mongoose";


export interface IProduct extends Document {
  name: string;
  price: number;
  status: boolean;
  description: string;
  quantity: number;
}


const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
});


export const Product = model<IProduct>('Product', productSchema);
