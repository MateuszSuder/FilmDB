import express from 'express';
import { favoritesView } from '../controllers/favoritesController.js';
import auth from './utils/auth.js';
import { toggleFavorite } from '../controllers/favoritesController.js';

// Create router
const router = express.Router();

router.use(async (req, res, next) => {
	console.log(req.method);
	if (req.method === 'GET') {
		return auth(req, res, next);
	}
	next();
});

// Assign to router, paths with specific methods and controllers
router.get('/', favoritesView);
router.put('/', toggleFavorite);

// Export router
export default router;
