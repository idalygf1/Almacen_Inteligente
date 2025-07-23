import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  updateOrderStatusToPaid,
  deleteOrder,
} from "../controllers/order.controller";


const router = Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.put("/orders/:id/pay", updateOrderStatus);
router.delete("/orders/:id/cancel", deleteOrder);
router.patch("/:id/pay", updateOrderStatusToPaid);



export default router;
