import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation, useParams } from 'react-router-dom';
import './Navigation.css';
import { useData } from '../../context/dataContext';

const Navigation = () => {
  const [expanded, setExpanded] = useState(false);
  const [profile, setProfile] = useState(null);
  const { profileId } = useParams();
  const { getProfileByProfileId } = useData();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfileByProfileId(profileId);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [profileId, getProfileByProfileId]);

  const handleNavClick = () => {
    setExpanded(false);
  };

  if (!profile || !profile.navigation) {
    return null;
  }

  const { navigation } = profile;

  return (
    <Navbar expand="lg" className="navbar-custom" expanded={expanded} onToggle={(expanded) => setExpanded(expanded)}>
      <Container>
        <Link to={`/${profileId}`} className="navbar-brand">{navigation.brandName}</Link>
        <div className="vertical-divider"></div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-links">
            {navigation.links && navigation.links.map((link, index) => (
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