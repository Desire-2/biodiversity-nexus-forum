// src/components/PostList.js

import { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, InputGroup, FormControl, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [show, setShow] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    axios.get('/api/posts')
      .then((response) => {
        setPosts(response.data);
        setFilteredPosts(response.data);
      });
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = (post, edit = false) => {
    setModalContent(post);
    setIsEditing(edit);
    setShow(true);
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete('/api/posts', { data: { id: postId } });
      const updatedPosts = posts.filter(post => post._id !== postId);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put('/api/posts', {
        postId: modalContent._id,
        update: { title: modalContent.title, content: modalContent.content },
      });
      const updatedPosts = posts.map(post => (post._id === response.data._id ? response.data : post));
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      setShow(false);
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
      post.content.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div>
      <h1 className="my-4">Forum Posts</h1>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search posts"
          aria-label="Search posts"
          aria-describedby="basic-addon2"
          value={searchTerm}
          onChange={handleSearch}
        />
        <InputGroup.Append>
          <Button variant="outline-secondary">Search</Button>
        </InputGroup.Append>
      </InputGroup>
      {currentPosts.map((post) => (
        <Card key={post._id} className="mb-3">
          <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <Card.Text>{post.content}</Card.Text>
            <Button variant="primary" onClick={() => handleShow(post)}>Read More</Button>
            {session && session.userId === post.author._id && (
              <>
                <Button variant="secondary" onClick={() => handleShow(post, true)} className="ms-2">Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(post._id)} className="ms-2">Delete</Button>
              </>
            )}
          </Card.Body>
        </Card>
      ))}

      <Pagination className="mt-4">
        <Pagination.First onClick={() => handlePageChange(1)} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)} />
        {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, i) => (
          <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(currentPage < Math.ceil(filteredPosts.length / postsPerPage) ? currentPage + 1 : Math.ceil(filteredPosts.length / postsPerPage))} />
        <Pagination.Last onClick={() => handlePageChange(Math.ceil(filteredPosts.length / postsPerPage))} />
      </Pagination>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Post' : modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isEditing ? (
            <Form>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={modalContent.title}
                  onChange={(e) => setModalContent({ ...modalContent, title: e.target.value })}
                />
              </Form.Group>

              <Form.Group controlId="formContent">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={modalContent.content}
                  onChange={(e) => setModalContent({ ...modalContent, content: e.target.value })}
                />
              </Form.Group>
            </Form>
          ) : (
            modalContent.content
          )}
        </Modal.Body>
        <Modal.Footer>
          {isEditing ? (
            <Button variant="primary" onClick={handleEdit}>
              Save Changes
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
