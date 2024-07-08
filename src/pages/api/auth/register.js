import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    try {
      console.log(req.body); // Log the request body for debugging
      const { username, email, password, confirmPassword, name } = req.body;

      if (!username || !email || !password || !confirmPassword || !name) {
        return res.status(400).json({ success: false, error: 'Please provide username, email, password, confirm password, and name.' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, error: 'Passwords do not match.' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email already in use.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({ username, email, password: hashedPassword, name });

      const userResponse = { ...user._doc };
      delete userResponse.password;

      res.status(201).json({ success: true, data: userResponse });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, error: messages.join(', ') });
      }
      res.status(500).json({ success: false, error: 'Server error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
