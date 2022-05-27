import express from 'express';

import {
	addMovieView,
	editMovieView,
	movieFormHandler,
} from '../controllers/addMovieController.js';

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
router.get('/', addMovieView);
router.get('/:id', editMovieView);
router.post('/', movieFormHandler);

// Export router
export default router;
