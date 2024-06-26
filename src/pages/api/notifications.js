import dbConnect from '../../../utils/dbConnect';
import Notification from '../../../models/Notification';

dbConnect();

const handleNotifications = async (req, res) => {
  const { userId } = req.query;
  if (req.method === 'GET') {
    try {
      const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default handleNotifications;