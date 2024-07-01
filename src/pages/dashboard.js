import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import Header from '@/components/Header';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
      const response = await axios.get('/api/user');
      if (response.data) {
        setUser(response.data);
      } else {
        router.push('/login');
      }
     } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        console.error("Error fetching events:", err);
      }
    };
    fetchUser();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-4">
      <Header />
      <h1 className="text-center mb-4">User Dashboard</h1>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
              <Card.Title>Profile</Card.Title>
              <Card.Text>Name: {user.name}</Card.Text>
              <Card.Text>Email: {user.email}</Card.Text>
              <Button variant="primary" href="/profile/edit">Edit Profile</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>My Activity</Card.Title>
              <p>Threads Created: {user.threads.length}</p>
              <p>Comments Posted: {user.comments.length}</p>
              <Button variant="primary" href="/threads">View My Threads</Button>
              <Button variant="primary" href="/comments">View My Comments</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
};

export default Dashboard;
