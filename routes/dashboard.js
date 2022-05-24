import express from 'express';
import { dashboardView } from '../controllers/dashboardController.js'

// Create router
const router = express.Router();

// Assign to router, paths with specific methods and controllers
router.get('/', dashboardView);

// Export router
export default router;