import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';

const PostPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(`/api/posts/${id}`);
      setPost(response.data.data);
    };

    const fetchComments = async () => {
      const response = await axios.get(`/api/comments?postId=${id}`);
      setComments(response.data.data);
    };

    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('/api/comments', { content, postId: id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments([...comments, response.data.data]);
      setContent('');
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        <h2>Comments</h2>
        <ul>
          {comments.map(comment => (
            <li key={comment._id}>{comment.content} by {comment.author.username}</li>
          ))}
        </ul>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="content" className="form-label">Add a comment</label>
            <textarea className="form-control" id="content" rows="3" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PostPage;
