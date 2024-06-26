import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link'; // Import Link for Next.js navigation

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 py-5">
      <Container>
        <Row className="mb-4 text-center text-md-start">
          <Col md={3} className="mb-4">
            <h5>About Us</h5>
            <p>We are passionate about fostering a community centered on biodiversity awareness and knowledge sharing. Join us in making a difference.</p>
            <Link href="/about" passHref>
              <Button variant="outline-light" className="mt-2">Read More</Button>
            </Link>
          </Col>
          <Col md={3} className="mb-4">
  <h5>Follow Us</h5>
  <div className="d-flex justify-content-center justify-content-md-start">
    <a href="https://facebook.com" className="text-white me-3"><FaFacebook size={30} /></a>
    <a href="https://twitter.com" className="text-white me-3"><FaTwitter size={30} /></a>
    <a href="https://instagram.com" className="text-white me-3"><FaInstagram size={30} /></a>
    <a href="https://linkedin.com" className="text-white"><FaLinkedin size={30} /></a>
  </div>
</Col>
          <Col md={3} className="mb-4">
            <h5>Newsletter Signup</h5>
            <form>
              <input type="email" placeholder="Enter email" className="form-control mb-2" />
              <Button variant="primary" type="submit" className="w-100">Subscribe</Button>
            </form>
          </Col>
          <Col md={3} className="mb-4">
            <h5>Contact Us</h5>
            <p>Questions or feedback? We&apos;d love to hear from you. Let&apos;s connect.</p>
            <Link href="/contact" passHref>
              <Button variant="outline-light" className="mt-2">Get in Touch</Button>
            </Link>
          </Col>
        </Row>
        <hr className="bg-light" />
        <Row>
          <Col className="text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} Biodiversity Nexus Forum. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;