import express from 'express';
import { sendMail, retrieveMail } from '../services/Email.js';

const router = express.Router();

router.post('/send-email', sendMail);
router.get('/read-emails', retrieveMail);

export default router;