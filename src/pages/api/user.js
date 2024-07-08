import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import Session from '../../../models/Session'; // Assuming you have a Session model
import { getSession } from 'next-auth/react';

const userHandler = async (req, res) => {
  await dbConnect();

  const session = await getSession({ req });

  if (!session) {
    console.log('No session found');
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    // Fetch session from the database if necessary
    const dbSession = await Session.findOne({ sessionToken: session.sessionToken });

    if (!dbSession) {
      console.log('Session not found in the database');
      return res.status(401).json({ message: 'Session not found' });
    }

    console.log(`Fetching user data for user ID: ${dbSession.userId}`);
    const user = await User.findById(dbSession.userId).populate('threads').populate('comments');

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User data fetched successfully:', user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default userHandler;
