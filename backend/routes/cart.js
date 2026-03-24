import express from 'express';
import { clearUserCart, getUserCart, removeCartItem, upsertCartItem } from '../Controller/cartController.js';

const router = express.Router();

router.get('/:userId', getUserCart);
router.post('/item', upsertCartItem);
router.delete('/:userId/items/:productId', removeCartItem);
router.delete('/:userId/clear', clearUserCart);

export default router;
