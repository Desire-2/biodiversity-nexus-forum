import User from '../../../../models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import initMiddleware from '../../../../utils/init-middleware';
import dbConnect from '../../../../utils/dbConnect';
import { getClientIp } from 'request-ip';

// Apply rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many password reset requests from this IP, please try again later.',
  keyGenerator: (req) => getClientIp(req) || req.headers['x-forwarded-for'] || req.connection.remoteAddress
});

// Initialize the middleware
const limiterMiddleware = initMiddleware(limiter);

export default async function handler(req, res) {
  await limiterMiddleware(req, res);

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await dbConnect();

    const email = req.body.email;

    // Validate input
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // To prevent email enumeration, consider always returning a success message.
      return res.status(200).json({ success: true, message: 'If an account with that email exists, a reset email has been sent.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

   // Ensure these environment variables are correctly set in your .env file or environment
const smtpConfig = {
  host: process.env.SMTP_HOST, // Verify this is the correct SMTP server address
  port: process.env.SMTP_PORT, // Verify this is the correct port
  secure: true, // Set to false if the SMTP server does not use SSL/TLS
  auth: {
    user: process.env.YAHOO_EMAIL_USERNAME, // Ensure this is the correct username
    pass: process.env.YAHOO_EMAIL_PASSWORD, // Ensure this is the correct password
  },
};

// Consider logging the SMTP configuration for debugging purposes (remove in production!)
console.log('SMTP Config:', smtpConfig);

const transporter = nodemailer.createTransport(smtpConfig);

// The rest of your code remains unchanged

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_FROM,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             http://${req.headers.host}/reset-password/${resetToken}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'A reset email has been sent to the provided email address.' });
  } catch (error) {
    console.error('Error in forgot-password handler:', error);

    if (error.name === 'MongooseError') {
      res.status(500).json({ success: false, message: 'Database connection error.' });
    } else {
      res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
    }
  }
}
