import express from 'express';
import { favoritesView } from '../controllers/favoritesController.js';
import auth from './utils/auth.js';

// Create router
const router = express.Router();

router.use(async (req, res, next) => {
	auth(req, res, next);
});

// Assign to router, paths with specific methods and controllers
router.get('/', favoritesView);

// Export router
export default router;
