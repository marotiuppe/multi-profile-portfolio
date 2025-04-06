import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';
import { useProfile } from '../../context/ProfileContext';

const Navigation = () => {
  const [expanded, setExpanded] = useState(false);
  const { currentProfile, loading, error, profileId } = useProfile();
  const location = useLocation();

  const handleNavClick = () => {
    setExpanded(false);
  };

  if (loading) {
    return;
  }

  if (error || !currentProfile) {
    return;
  }

  const { navigation } = currentProfile;

  return (
    <Navbar expand="lg" className="navbar-custom" expanded={expanded} onToggle={(expanded) => setExpanded(expanded)}>
      <Container>
        <Link to={`/${profileId}`} className="navbar-brand">{navigation.brandName}</Link>
        <div className="vertical-divider"></div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-links">
            {navigation.links.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                {link.label}
              </Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 