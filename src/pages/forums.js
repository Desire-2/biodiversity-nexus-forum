import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import Footer from '../components/Footer';
import Header from '@/components/Header';

const Forums = () => {
  const [forums, setForums] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await axios.get('/api/forums');
        setForums(response.data);
      } catch (err) {
        setError('Failed to fetch forums. Please try again later.');
        console.error("Error fetching forums:", err);
      }
    };
    fetchForums();
  }, []);

  return (
    <div>
    <Header />
    <Container className="mt-4">
      <h1 className="text-center mb-4">Forums</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {forums.map(forum => (
          <Col md={4} key={forum._id}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{forum.title}</Card.Title>
                <Card.Text>{forum.description}</Card.Text>
                <Button variant="primary" href={`/forums/${forum._id}`}>View Forum</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    <Footer />
    </div>
  );
};

export default Forums;