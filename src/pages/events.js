import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import Footer from '../components/Footer';
import Header from '@/components/Header';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
    <Header />
    <Container className="mt-4">
      <h1 className="text-center mb-4">Events</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {events.map(event => (
          <Col md={4} key={event._id}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>{event.description}</Card.Text>
                <Button variant="warning" href={`/events/${event._id}`}>View Event</Button>
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

export default Events;