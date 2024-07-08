// Import necessary modules for database connection and User model
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

// Connect to the database
dbConnect();

// API handler function to update or get a user's profile based on the HTTP method
export default async function handler(req, res) {
  const {
    query: { userId },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      break;

    case 'PUT':
      try {
        const { profileData } = req.body;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        user.profilePicture = profileData.profilePicture || user.profilePicture;
        user.bio = profileData.bio || user.bio;
        user.socialLinks = profileData.socialLinks || user.socialLinks;
        await user.save();
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}