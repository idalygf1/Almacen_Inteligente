import { Schema, model, Types } from 'mongoose';

const orderSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      productId: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  status: {
    type: String,
    enum: ['Pendiente', 'Pagado', 'Cancelado'],
    default: 'Pendiente'
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  updateDate: {
    type: Date,
    default: Date.now
  }
});

export const Order = model('Order', orderSchema);
