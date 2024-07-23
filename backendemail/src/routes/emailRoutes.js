import express from 'express';
import { sendMail, retrieveInBoxMail } from '../services/Email.js';

const router = express.Router();

router.post('/send-email', sendMail);
router.get('/read-emails', retrieveInBoxMail);

export default router;