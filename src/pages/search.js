import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import axios from 'axios';
import Footer from '../components/Footer';

const Search = () => {
  const router = useRouter();
  const { query } = router.query;
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        const response = await axios.get(`/api/search?query=${query}`);
        setResults(response.data);
      };
      fetchResults();
    }
  }, [query]);

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Search Results</h1>
      <Row>
        {results.map(result => (
          <Col md={4} key={result._id}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{result.title}</Card.Title>
                <Card.Text>{result.summary}</Card.Text>
                <Button href={`/details/${result._id}`}>View Details</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Footer />
    </Container>
  );
};

export default Search;
