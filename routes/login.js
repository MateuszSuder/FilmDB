import express from 'express';
import { loginUser, loginView } from '../controllers/loginController.js'

const router = express.Router();

router.get('/', loginView);
router.post('/', loginUser);

export default router;