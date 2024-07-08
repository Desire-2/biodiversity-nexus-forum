// pages/error.js
import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const ErrorPage = ({ error }) => {
  const errorMessage = {
    Configuration: 'Login is currently unavailable. Please try again later.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'Your email could not be verified.',
    CredentialsSignin: 'Sign in failed. Check your credentials and try again.',
    default: 'An unexpected error occurred. Please try again.',
  }[error] || errorMessage.default;

  return (
    <div>
      <Header />
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Error</h4>
          <p>{errorMessage}</p>
        </Alert>
      </Container>
      <Footer />
    </div>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      error: context.query.error || 'default',
    },
  };
}

export default ErrorPage;
