import express from 'express';
import { homeView } from '../controllers/homeController.js'

// Create router
const router = express.Router();

// Assign to router, paths with specific methods and controllers
router.get('/', homeView);

// Export router
export default router;