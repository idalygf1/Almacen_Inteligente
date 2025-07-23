// src/controllers/order.controller.ts
import { Request, Response } from "express";
import { Order } from "../models/order";

// Crear orden
export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ message: "Orden creada", order });
  } catch (error) {
    res.status(500).json({ message: "Error al crear orden", error });
  }
};

// Obtener todas las órdenes
export const getAllOrders = async (_req: Request, res: Response) => {
  const orders = await Order.find().populate("userId").populate("products.productId");
  res.json({ orders });
};

// Actualizar status a "Pagado"
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status: "Pagado", updateDate: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });
    res.json({ message: "Orden actualizada", order });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar", error });
  }
};

// Eliminar orden (status: Cancelado)
export const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status: "Cancelado", updateDate: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });
    res.json({ message: "Orden cancelada", order });
  } catch (error) {
    res.status(500).json({ message: "Error al cancelar orden", error });
  }
};

export const updateOrderStatusToPaid = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await Order.findByIdAndUpdate(id, { status: "Pagado" }, { new: true });
    res.json({ message: "Orden actualizada", order: updated });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar", error });
  }
};
