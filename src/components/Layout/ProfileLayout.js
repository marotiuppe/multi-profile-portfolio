import React from 'react';
import { useParams, Routes, Route, Navigate } from 'react-router-dom';
import { useData } from '../../context/dataContext';
import Layout from './Layout';
import About from '../../pages/About';
import Resume from '../../pages/Resume';
import Projects from '../../pages/Projects';
import Contact from '../../pages/Contact';
import Home from '../../pages/Site';

const ProfileLayout = () => {
  const { profileId } = useParams();
  const { getProfileByProfileId } = useData();
  const profile = getProfileByProfileId(profileId);

  // Redirect to 404 if no profile found
  if (!profile) {
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