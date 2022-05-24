import express from 'express';
import { logoutController } from '../controllers/logoutController.js'

// Create router
const router = express.Router();

// Assign to router, paths with specific methods and controllers
router.post('/', logoutController);

// Export router
export default router;