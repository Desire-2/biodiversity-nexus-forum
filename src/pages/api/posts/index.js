import dbConnect from '../../../../utils/dbConnect';
import Post from '../../../../models/Post';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { getSession } from 'next-auth/react';

const form = new IncomingForm();

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  const session = await getSession({ req });
  if (!session && method === 'POST') {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  if (method === 'POST') {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Error parsing form data' });
      }

      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { title, content } = fields;
        let imageUrl = null;

        if (files.image) {
          imageUrl = await uploadImage(files.image);
        }

        const post = await Post.create({ title, content, image: imageUrl, author: userId });
        res.status(201).json({ success: true, data: post });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    });
  } else if (method === 'GET') {
    // Existing GET logic
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function uploadImage(imageFile) {
  return 'http://example.com/path/to/image.jpg';
}
