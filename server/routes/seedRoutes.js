import express from 'express';

import { seedProduct } from '../controllers/seedControllers.js';

const router = express.Router();

router.get('/',seedProduct);

export default router;
