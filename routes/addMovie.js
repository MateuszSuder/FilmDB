import express from 'express';

import {
	addMovieView,
	editMovieView,
} from '../controllers/addMovieController.js';

// Create router
const router = express.Router();

// Assign to router, paths with specific methods and controllers
router.get('/', addMovieView);
router.get('/:id', editMovieView);

// Export router
export default router;
