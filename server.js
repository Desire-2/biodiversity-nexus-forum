const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
import http from 'http';
import { Server } from 'socket.io';


const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/biodiversity-forum', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  date: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

app.get('/api/posts', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.post('/api/posts', async (req, res) => {
  const newPost = new Post(req.body);
  await newPost.save();
  res.json(newPost);
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
