import { Request, Response } from 'express';
import { Order } from '../models/order';

// Crear orden
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, products, status } = req.body;

    if (!userId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Datos de orden incompletos' });
    }

    const order = await Order.create({ userId, products, status });
    res.status(201).json({ message: 'Orden creada', order });
  } catch (error) {
    console.error('❌ Error en createOrder:', error);
    res.status(500).json({ message: 'Error al crear orden', error });
  }
};

// Obtener todas las órdenes
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('userId')
      .populate('products.productId')
      .sort({ createDate: -1 });
    res.json({ orders });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ message: 'Error al obtener órdenes', error });
  }
};

// Actualizar estado a "Pagado"
export const updateOrderStatusToPaid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Order.findByIdAndUpdate(
      id,
      { status: 'Pagado', updateDate: new Date() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.json({ message: 'Orden marcada como pagada', order: updated });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ message: 'Error al actualizar estado', error });
  }
};

// Cancelar orden
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Order.findByIdAndUpdate(
      id,
      { status: 'Cancelado', updateDate: new Date() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.json({ message: 'Orden cancelada', order: updated });
  } catch (error) {
    console.error('Error al cancelar orden:', error);
    res.status(500).json({ message: 'Error al cancelar orden', error });
  }
};

// Eliminar orden
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.json({ message: 'Orden eliminada' });
  } catch (error) {
    console.error('Error al eliminar orden:', error);
    res.status(500).json({ message: 'Error al eliminar orden', error });
  }
};

// Editar orden (productos o estado)
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.json({ message: 'Orden actualizada', order: updated });
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    res.status(500).json({ message: 'Error al actualizar orden', error });
  }
};
