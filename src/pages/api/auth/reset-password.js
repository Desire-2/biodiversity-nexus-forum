import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    try {
      const { token, password, confirmPassword } = req.body;

      if (!token || !password || !confirmPassword) {
        return res.status(400).json({ success: false, error: 'Please provide token, password, and confirm password.' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, error: 'Passwords do not match.' });
      }

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ success: false, error: 'Password reset token is invalid or has expired.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      res.status(200).json({ success: true, message: 'Password reset successful.' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
