import { Router } from "express";
import {
  login,
  getTimeToken,
  updateToken,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/auth.controller";


const router = Router();

// Rutas de autenticación y usuarios
router.post("/login", login); // login debe ser una función
router.get("/getTime/:userId", getTimeToken);
router.patch("/update/:userId", updateToken);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);


export default router;
