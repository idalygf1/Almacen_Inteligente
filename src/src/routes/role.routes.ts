import { Router } from "express";
import {
  createRole,
  getAllRoles,
  getMenuByRole,
} from "../controllers/role.controller";

const router = Router();

router.post("/", createRole);
router.get("/", getAllRoles);
router.get("/menu/:roleName", getMenuByRole); // ✔️ Ruta corregida

export default router;
