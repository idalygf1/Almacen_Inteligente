import { Router } from "express";
import { getMenuByRole } from "../controllers/menu.controller";
import { verifyToken } from "../middleware/authJwt";

const router = Router();

router.get("/options", verifyToken, getMenuByRole);

export default router;