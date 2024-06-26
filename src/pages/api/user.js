import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import { getSession } from 'next-auth/react';

dbConnect();

const userHandler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const user = await User.findById(session.user.id).populate('threads').populate('comments');
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

export default userHandler;