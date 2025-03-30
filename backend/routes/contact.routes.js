import express from 'express';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';

// prevents spamming causing ddos attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    }
});

const router = express.Router();

router.post('/', limiter, async (req, res) => {
    const { firstName, lastName, email, message } = req.body;

    try {
        console.log('Creating transporter with:', {
            service: 'gmail',
            user: process.env.EMAIL_USER,
            passLength: process.env.EMAIL_PASS?.length
        });

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            debug: true // Enable debug logging
        });

        // Verify the connection configuration
        await transporter.verify();

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Help Form Submission',
            text: `From: ${firstName} ${lastName} (${email})\n\nMessage:\n${message}`
        };

        console.log('Attempting to send email with options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        });

        await transporter.sendMail(mailOptions);
        res.status(200).json({success: true, message: 'Message sent successfully'});
    } catch (e) {
        console.error('Detailed error:', {
            message: e.message,
            code: e.code,
            command: e.command,
            response: e.response,
            responseCode: e.responseCode
        });
        res.status(500).json({
            success: false, 
            message: 'Message not sent', 
            error: e.message,
            details: e.response
        });
    }
});




export default router;

