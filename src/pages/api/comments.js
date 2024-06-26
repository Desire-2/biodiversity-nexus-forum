import dbConnect from '../../../utils/dbConnect';
import Comment from '../../../models/Comment';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const { content, postId } = req.body;
      const comment = await Comment.create({ content, post: postId, author: userId });

      res.status(201).json({ success: true, data: comment });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (method === 'GET') {
    try {
      const { postId } = req.query;
      const comments = await Comment.find({ post: postId }).populate('author', 'username');
      res.status(200).json({ success: true, data: comments });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(400).json({ success: false, error: 'Invalid request method' });
  }
}
