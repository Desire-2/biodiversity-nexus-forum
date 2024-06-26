import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { FaForumbee, FaRegNewspaper, FaCalendarAlt, FaBriefcase } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import Footer from '@/components/Footer';
import Header from '../components/Header';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/posts?page=${page}&limit=10`);
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch posts. Please try again later.');
      }
    };
    fetchPosts();
  }, [page]);

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'New Users',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div>
      <Header />
    <Container className="mt-4">
      <div className="hero-section text-center mb-4">
        <h1 className="display-4 animate__animated animate__fadeInDown">Welcome to the Biodiversity Nexus Forum</h1>
        <p className="lead animate__animated animate__fadeInUp">
          Join our community to discuss and share knowledge about biodiversity.
        </p>
        <Button variant="primary" href="/register" className="mb-3 animate__animated animate__pulse animate__infinite">
          Join Now
        </Button>
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="mb-4 shadow-lg">
            <Card.Body className="animate__animated animate__fadeInLeft">
              <Card.Title>Community Growth</Card.Title>
              <Line data={chartData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow-lg">
            <Card.Body className="animate__animated animate__fadeInRight">
              <Card.Title>Recent Activity</Card.Title>
              <p>Threads Created: 150</p>
              <p>Comments Posted: 1200</p>
              <p>New Members: 300</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card className="mb-4 shadow-lg">
            <Card.Body className="text-center animate__animated animate__zoomIn">
              <FaForumbee size={50} className="mb-3 text-primary" />
              <Card.Title>Forums</Card.Title>
              <Card.Text>
                Participate in various forums focused on different aspects of biodiversity.
              </Card.Text>
              <Button variant="primary" href="/forums" className="mt-3">Explore Forums</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-lg">
            <Card.Body className="text-center animate__animated animate__zoomIn animate__delay-1s">
              <FaRegNewspaper size={50} className="mb-3 text-success" />
              <Card.Title>Articles</Card.Title>
              <Card.Text>
                Read and share articles related to biodiversity research and news.
              </Card.Text>
              <Button variant="success" href="/articles" className="mt-3">Read Articles</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-lg">
            <Card.Body className="text-center animate__animated animate__zoomIn animate__delay-2s">
              <FaCalendarAlt size={50} className="mb-3 text-warning" />
              <Card.Title>Events</Card.Title>
              <Card.Text>
                Stay updated with upcoming events, workshops, and webinars.
              </Card.Text>
              <Button variant="warning" href="/events" className="mt-3">View Events</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-lg">
            <Card.Body className="text-center animate__animated animate__zoomIn animate__delay-2s">
              <FaBriefcase size={50} className="mb-3 text-warning" />
              <Card.Title>Rwanda Job Board</Card.Title>
              <Card.Text>
                Stay updated with trending jobs in Rwanda.
              </Card.Text>
              <Button variant="warning" href="/jobs" className="mt-3">View Opportunities</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Footer />
    </Container>
    </div> 
  );
};

export default Home;