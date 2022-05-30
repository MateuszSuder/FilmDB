import express from 'express';
import auth from './utils/auth.js';

import {
	addMovieView,
	editMovieView,
	movieFormHandler,
} from '../controllers/addMovieController.js';

// Create router
const router = express.Router();

// Middleware to secure endpoints
router.use(async (req, res, next) => {
	auth(req, res, next);
});

// Assign to router, paths with specific methods and controllers
router.get('/', addMovieView);
router.get('/:id', editMovieView);
router.post('/', movieFormHandler);

// Export router
export default router;
