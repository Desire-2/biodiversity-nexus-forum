// Import necessary modules
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

// Connect to the database
dbConnect();

// Define the API endpoint for updating a user's profile
const updateProfile = async (req, res) => {
  // Check if the request method is PUT
  if (req.method === 'PUT') {
    // Destructure userId and profileData from the request body
    const { userId, profileData } = req.body;

    try {
      // Find the user by ID
      const user = await User.findById(userId);

      // If user is not found, return a 404 error
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user's profile with the provided data or keep the existing data if not provided
      user.profilePicture = profileData.profilePicture || user.profilePicture;
      user.bio = profileData.bio || user.bio;
      user.socialLinks = profileData.socialLinks || user.socialLinks;

      // Save the updated user
      await user.save();

      // Return the updated user
      res.status(200).json(user);
    } catch (error) {
      // If an error occurs, return a 500 error with the error message
      res.status(500).json({ message: error.message });
    }
  } else {
    // If the request method is not PUT, return a 405 Method Not Allowed error
    res.setHeader('Allow', ['PUT']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
};

// Export the API endpoint
export default updateProfile;