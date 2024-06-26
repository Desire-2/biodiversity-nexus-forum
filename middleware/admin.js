import jwt from 'jsonwebtoken';
import User from '../models/User';

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};

export default adminMiddleware;
