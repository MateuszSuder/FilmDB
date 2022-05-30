import express from 'express';
import {
	dashboardView,
	modifyUserPermission,
	deleteUser,
	blockUser,
} from '../controllers/dashboardController.js';
import { toggleFavorite } from '../controllers/favoritesController.js';
import auth from './utils/auth.js';

// Create router
const router = express.Router();

// Middleware to secure endpoints
router.use(async (req, res, next) => {
	auth(req, res, next);
});

// Assign to router, paths with specific methods and controllers
router.get('/', dashboardView);
router.put('/permission', modifyUserPermission);
router.delete('/delete', deleteUser);
router.put('/block', blockUser);
router.put('/favorite', toggleFavorite);

// Export router
export default router;
