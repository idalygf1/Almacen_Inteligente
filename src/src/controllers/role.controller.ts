import { Request, Response } from "express";

// Simulación de menú por rol
const menuByRole: Record<string, string[]> = {
  admin: ["dashboard", "usuarios", "configuracion"],
  user: ["perfil", "pedidos"],
  guest: ["inicio", "productos"],
};

export const getMenuByRole = (req: Request, res: Response) => {
  const { roleName } = req.params;
  const menu = menuByRole[roleName.toLowerCase()];

  if (!menu) {
    return res.status(404).json({ message: "Rol no encontrado" });
  }

  res.json({
    message: `Menú para rol: ${roleName}`,
    menu,
  });
};
