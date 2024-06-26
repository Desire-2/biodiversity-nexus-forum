import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

dbConnect();

const updateProfile = async (req, res) => {
  if (req.method === 'PUT') {
    const { userId, profileData } = req.body;
    try {
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
  }
};

export default updateProfile;