import express from 'express';
import { editMovieFormHandler } from '../controllers/addMovieController.js';

// Create router
const router = express.Router();

// Assign to router, paths with specific methods and controllers
router.post('/', editMovieFormHandler);

// Export router
export default router;
