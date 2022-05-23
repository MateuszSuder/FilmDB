import express from 'express';
import { loginView } from '../controllers/loginController.js'

const router = express.Router();

router.get('/', loginView);

export default router;