import { Router } from "express";
import {
  createRole,
  getAllRoles,
  getMenuByRole,
} from "../controllers/role.controller";

const router = Router();

router.post("/", createRole); // ✅ Ya es función válida
router.get("/", getAllRoles);
router.get("/menu/:roleName", getMenuByRole); // ✅ Menú por rol

export default router;
