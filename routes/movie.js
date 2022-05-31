import express from 'express';
import { deleteMovie, movieView } from '../controllers/movieController.js';

const router = express.Router();

router.get('/:id', movieView);
router.delete('/:id', deleteMovie);

export default router;
