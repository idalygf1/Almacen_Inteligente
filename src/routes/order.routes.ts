import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  updateOrder,
  updateOrderStatusToPaid,
  cancelOrder,
  deleteOrder
} from '../controllers/order.controller';

const router = Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.patch('/:id', updateOrder); // editar completa
router.patch('/:id/pay', updateOrderStatusToPaid); // marcar como pagado
router.patch('/:id/cancel', cancelOrder); // cancelar orden
router.delete('/:id', deleteOrder); // eliminar

export default router;
