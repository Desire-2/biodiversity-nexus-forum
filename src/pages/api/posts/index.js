import dbConnect from '../../../../utils/dbConnect';
import Post from '../../../../models/Post';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const { title, content } = req.body;
      const post = await Post.create({ title, content, author: userId });

      res.status(201).json({ success: true, data: post });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (method === 'GET') {
    try {
      const posts = await Post.find().populate('author', 'username');
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(400).json({ success: false, error: 'Invalid request method' });
  }
}
app.get('/api/posts', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
      const posts = await Post.find()
        .populate('author', 'username')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      
      const count = await Post.countDocuments();
      
      res.json({
        posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
    app.get('/api/posts/:id', async (req, res) => {
        try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
    
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
    
        res.json(post);
        } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        }
    });
    app.delete('/api/posts/:id', async (req, res) => {
        try {
        const post = await Post.findById(req.params.id);
    
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
    
        await post.remove();
    
        res.json({ msg: 'Post removed' });
        } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        }
    });
    app.put('/api/posts/:id', async (req, res) => {
        const { title, content } = req.body;
    
        const postFields = {};
        if (title) postFields.title = title;
        if (content) postFields.content = content;
    
        try {
        let post = await Post.findById(req.params.id);
    
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
    
        post = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: postFields },
            { new: true }
        );
    
        res.json(post);
        } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        }
    });
      
