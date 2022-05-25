import express from 'express';
import {
	dashboardView,
	modifyUserPermission,
	deleteUser,
	blockUser,
} from '../controllers/dashboardController.js';

// Create router
const router = express.Router();

// Middleware to secure endpoints
router.use(async (req, res, next) => {
	if (!req.session.user || req.session.user?.permission === 'user') {
		if (req.method === 'GET') {
			return res.redirect('/');
		} else {
			return res.status(401).json({ error: 'Unauthorized' });
		}
	}

	next();
});

// Assign to router, paths with specific methods and controllers
router.get('/', dashboardView);
router.put('/permission', modifyUserPermission);
router.delete('/delete', deleteUser);
router.put('/block', blockUser);

// Export router
export default router;
