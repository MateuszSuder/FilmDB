import express from 'express';
import { favoritesView } from '../controllers/favoritesController.js';

// Create router
const router = express.Router();

// Assign to router, paths with specific methods and controllers
router.get('/', favoritesView);

// Export router
export default router;
