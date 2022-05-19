import express from 'express';
import { homeView } from '../controllers/homeController.js'

const router = express.Router();

router.get('/', homeView);

export default router;