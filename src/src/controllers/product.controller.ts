// src/controllers/product.controller.ts
import { Request, Response } from "express";
import { Product } from "../models/products";
import { Types } from "mongoose";

// CREATE
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Producto creado", product });
  } catch (error) {
    res.status(500).json({ message: "Error al crear producto", error });
  }
};

// GET ALL
export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await Product.find();
  res.json({ products });
};

// UPDATE
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID no válido" });
  }
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto actualizado", product });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar producto", error });
  }
};

// DELETE (STATUS => false)
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID no válido" });
  }
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto desactivado (status=false)", product });
  } catch (error) {
    res.status(500).json({ message: "Error al desactivar producto", error });
  }
};
