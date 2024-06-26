import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/User';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    try {
      const { username, email, password } = req.body;

      const user = await User.create({ username, email, password });

      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(400).json({ success: false, error: 'Invalid request method' });
  }
}
