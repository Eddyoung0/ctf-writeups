import express from 'express';
import { checkoutOrders, deleteOrder, getAllOrders, getDashboardOverview, getUserOrders, updateDeliveryStatus } from '../Controller/ordersController.js';

const router = express.Router();

router.post('/checkout', checkoutOrders);
router.get('/overview', getDashboardOverview);
router.get('/', getAllOrders);
router.get('/user/:userId', getUserOrders);
router.patch('/:orderId/delivery-status', updateDeliveryStatus);
router.delete('/:orderId', deleteOrder);

export default router;
