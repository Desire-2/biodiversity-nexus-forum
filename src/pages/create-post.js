import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios'; // Import axios
import Image from 'next/image';
import styles from './CreatePost.module.css'; // Ensure this file exists
import Footer from '../components/Footer';
import Header from '../components/Header'; // Import Header

const CreatePost = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
{/* 
  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    }
  }, [status]);
*/}

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
{/* 
    if (!session) {
      setAlert({ show: true, message: 'Please sign in to create a post.', variant: 'danger' });
      return;
    }
      */}

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      const response = await axios.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAlert({ show: true, message: 'Post created successfully!', variant: 'success' });
      setTitle('');
      setContent('');
      setImage(null);
      setPreview(null);
      setTimeout(() => router.push('/posts'), 1500); // Redirect to posts page after success
    } catch (error) {
      setAlert({ show: true, message: 'Error creating post', variant: 'danger' });
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Create a New Post</h1>
        {alert.show && <div className={`${styles.alert} ${styles[alert.variant]}`}>{alert.message}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className={styles.input}
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
              className={styles.input}
              id="content"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="image">Image</label>
            <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
          </div>
          {preview && (
            <div className={styles.formGroup}>
              <Image src={preview} alt="Image preview" width={200} height={200} />
            </div>
          )}
          <button type="submit" className={styles.button}>Submit</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePost;
