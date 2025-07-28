import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { exportTransactions } from '../controllers/exportController.js';

const router = express.Router();

// Protect all routes with authentication middleware
router.use(protect);

// Export all transactions to Excel
router.get('/transactions', exportTransactions);

export default router;
