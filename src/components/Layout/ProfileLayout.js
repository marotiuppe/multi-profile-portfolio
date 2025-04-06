import React from 'react';
import { useParams, Routes, Route, Navigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import Layout from './Layout';
import About from '../../pages/About';
import Resume from '../../pages/Resume';
import Projects from '../../pages/Projects';
import Contact from '../../pages/Contact';
import Home from '../../pages/Site';

const ProfileLayout = () => {
  const { profileId } = useParams();
  const { currentProfile, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="loading-container d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to 404 if there's an error or no profile
  if (error || !currentProfile) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to={`/${profileId}`} replace />} />
      </Routes>
    </Layout>
  );
};

export default ProfileLayout; 