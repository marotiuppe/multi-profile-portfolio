import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import ProfileSection from './ProfileSection';
import Navigation from './Navigation';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isResumePage = location.pathname.endsWith('/resume');

  return (
    <div className="main-container">
      <Navigation />
      <Container fluid className="content-container">
        <Row className={isResumePage ? "justify-content-center" : ""}>
          {!isResumePage && (
            <Col xs={{ span: 12, order: 2 }} md={{ span: 4, order: 1 }} lg={4} className="content-col">
              <ProfileSection />
            </Col>
          )}
          <Col 
            xs={{ span: 12, order: 1 }} 
            md={{ span: isResumePage ? 10 : 8, order: 2 }} 
            lg={isResumePage ? 8 : 7} 
            className="content-col"
          >
            <div className={`main-content ${isResumePage ? "resume-content" : ""}`}>
              {children}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Layout; 