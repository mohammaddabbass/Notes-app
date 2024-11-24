import express from 'express';
const router = express.Router();
import {homepage, about} from '../controllers/mainController.js';

// App Routes
router.get('/', homepage);
router.get('/about', about);

export default router;