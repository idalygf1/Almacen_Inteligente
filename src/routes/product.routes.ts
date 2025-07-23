import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,         // ✅ Asegúrate que esto también esté en tu controlador
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";

const router = Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);      // ✅ Esta línea es la que faltaba
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
