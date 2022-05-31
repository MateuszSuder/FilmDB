import express from 'express';
import { deleteMovie, movieView } from '../controllers/movieController.js';
import auth from './utils/auth.js';

const router = express.Router();

router.use(async (req, res, next) => {
	if (req.method === 'DELETE') {
		return auth(req, res, next);
	}
	next();
});

router.get('/:id', movieView);
router.delete('/:id', deleteMovie);

export default router;
