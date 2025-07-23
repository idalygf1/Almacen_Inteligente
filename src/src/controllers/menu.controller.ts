import { Request, Response } from "express";
import { Menu } from "../models/menu";
import { User } from "../models/user";

export const getMenuByRole = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId || req.userId;
    const user = await User.findById(userId).populate("role");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const roleId = user.role._id;
    const menuOptions = await Menu.find({ roles: roleId });

    res.status(200).json(menuOptions);
  } catch (error) {
    console.error("Error al obtener el menú:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};