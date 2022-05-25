import express from 'express';
import {
	dashboardView,
	modifyUserPermission,
	deleteUser,
	blockUser,
} from '../controllers/dashboardController.js';

// Create router
const router = express.Router();

router.use(async (req, res, next) => {
	if (!req.session.user?.permission) {
		if (req.method === 'GET') {
			console.log('get', req.method);
		} else {
			console.log(req.method);
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
