import { Schema, model, Document, Types } from "mongoose";

interface IOrderProduct {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  status: string;
  products: IOrderProduct[];
  createDate: Date;
  updateDate: Date;
}

const orderProductSchema = new Schema<IOrderProduct>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, default: "Pendiente" },
  products: [orderProductSchema],
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
});

export const Order = model<IOrder>("Order", orderSchema);