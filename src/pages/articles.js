import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import Footer from '../components/Footer';
import Header from '@/components/Header';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('/api/articles');
        setArticles(response.data);
      } catch (err) {
        setError('Failed to fetch articles. Please try again later.');
        console.error("Error fetching articles:", err);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div>
    <Header />
    <Container className="mt-4">
      <h1 className="text-center mb-4">Articles</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {articles.map(article => (
          <Col md={4} key={article._id}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{article.title}</Card.Title>
                <Card.Text>{article.summary}</Card.Text>
                <Button variant="success" href={`/articles/${article._id}`}>Read Article</Button>
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

export default Articles;