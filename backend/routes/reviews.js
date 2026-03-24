import express from 'express';
import { createReview, deleteReview, getReviews, updateReview } from '../Controller/reviewController.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
