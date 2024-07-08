import React, { useEffect, useState } from 'react';
import { Alert, Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); // Start loading
      try {
        const { data: session } = await axios.get('/api/auth/session');
        console.log('Session:', session);

        if (!session) {
          console.log('No session found, redirecting to login...');
          setError('Unauthorized. Please log in.');
          router.push('/login');
          return;
        }

        console.log('Session found:', session);
        const response = await axios.get('/api/user');
        console.log('API response:', response);

        if (response.data) {
          console.log('User data fetched successfully:', response.data);
          setUser(response.data);
        } else {
          console.log('Failed to fetch user data.');
          setError('Failed to fetch user data.');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (err.response && err.response.status === 401) {
          setError('Unauthorized. Please log in.');
          router.push('/login');
        } else {
          setError('Failed to fetch user data. Please try again later.');
        }
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  const activityData = {
    labels: ['Threads', 'Comments'],
    datasets: [
      {
        label: 'Activity',
        data: [
          user.threads ? user.threads.length : 0,
          user.comments ? user.comments.length : 0,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container className="mt-4">
      <Header />
      <h1 className="text-center mb-4">User Dashboard</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Profile</Card.Title>
              {user.profilePicture && (
                <div className="text-center mb-3">
                  <img src={user.profilePicture} alt="Profile" className="rounded-circle" width="100" height="100" />
                </div>
              )}
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
              <div className="chart-container">
                <Line data={activityData} />
              </div>
              <div className="d-flex justify-content-between mt-4">
                <Button variant="primary" href="/threads">View My Threads</Button>
                <Button variant="primary" href="/comments">View My Comments</Button>
                <Button variant="primary" href="/create-post">Create New Post</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
};

export default Dashboard;
