import express from 'express';
import { login, logout, signup , verifyEmail ,forgotPassword, resetPassword , checkAuth } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router=express.Router();

router.get('/check-Auth',verifyToken,checkAuth);

router.post('/signup',signup)
router.post('/logout',logout)
router.post('/login',login)
router.post('/forgotPassword',forgotPassword);
router.post('/reset-password/:token',resetPassword)


router.post('/verfiy-email',verifyEmail)

export default router;