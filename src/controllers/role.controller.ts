import { Request, Response } from "express";

// ✅ Menú completo con títulos, íconos y rutas por rol
const menuByRole: Record<string, any> = {
  admin: {
    id: "956489567425473",
    role: "admin",
    menu: [
      { title: "Dashboard", icon: "dashboard", path: "/dashboard" },
      { title: "Users", icon: "users", path: "/users" },
      { title: "Products", icon: "products", path: "/products" },
      { title: "Orders", icon: "orders", path: "/orders" }
    ]
  },
  employe: {
    id: "86950895793905",
    role: "employe",
    menu: [
      { title: "Orders", icon: "orders", path: "/orders" }
    ]
  }
};

// ✅ GET menú por rol
export const getMenuByRole = (req: Request, res: Response) => {
  const { roleName } = req.params;
  const config = menuByRole[roleName.toLowerCase()];

  if (!config) {
    return res.status(404).json({ message: "Rol no encontrado" });
  }

  res.json(config);
};

// ✅ POST crear rol (simulado)
export const createRole = (req: Request, res: Response) => {
  const { name } = req.body;
  res.status(201).json({
    message: `Rol '${name}' creado correctamente (simulado)`
  });
};

// ✅ GET todos los roles (simulado)
export const getAllRoles = (_req: Request, res: Response) => {
  res.json([
    { id: 1, name: "admin" },
    { id: 2, name: "employe" }
  ]);
};
