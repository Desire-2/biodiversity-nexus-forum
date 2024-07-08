import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    try {
      const { email, password, rememberMe } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide email and password.' });
      }

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(400).json({ success: false, error: 'Invalid credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, error: 'Invalid credentials.' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: rememberMe ? '7d' : '1h' });

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
