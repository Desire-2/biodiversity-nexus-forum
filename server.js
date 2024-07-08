const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dbConnect = require('./utils/dbConnect');
const dotenv = require('dotenv');
const Post = require('./models/Post');
const User = require('./models/User');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

dotenv.config();
dbConnect();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use(express.json());
app.use(cookieParser());


app.post('/api/auth/reset-password', async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  try {
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await post.remove();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, name } = req.body;

  try {
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ success: false, error: 'Email already in use.' });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ success: false, error: 'Username already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password: hashedPassword, name });

    res.status(201).json({ success: true, data: { id: user._id, username: user.username, email: user.email, name: user.name } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: rememberMe ? '7d' : '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // 7 days or 1 hour
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close(() => {
    console.log('HTTP server closed.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});
