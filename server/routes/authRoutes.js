import express from 'express';
import {signup,signin,google} from '../controllers/authControllers.js'

const router=express.Router();

router.post('/signin',signin);
router.post('/signup', signup);
router.post('/google',google);

export default router;