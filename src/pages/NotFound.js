import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './PageStyles.css';

const NotFound = () => {
  return (
    <Container className="not-found-container min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="text-center">
        <Col xs={12}>
          <h1 className="display-1 fw-bold">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="lead mb-4">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <Button as={Link} to="/" variant="primary" size="lg">
            Go Back Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound; 