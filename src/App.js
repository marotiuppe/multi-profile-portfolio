import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Site from './pages/Site';
import About from './pages/About';
import Resume from './pages/Resume';
import Projects from './pages/Projects';
import Stats from './pages/Stats';
import Contact from './pages/Contact';
import { Global, css } from '@emotion/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProfileProvider } from './context/ProfileContext';
// import data from './data/data.json';
import NotFound from './pages/NotFound';
import './App.css';

const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f8f8;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 1rem;
  }
`;

const ProfileLayout = () => {
  return (
    <ProfileProvider>
        <Layout>
        <Routes>
          <Route index element={<Site />} />
          <Route path="about" element={<About />} />
          <Route path="resume" element={<Resume />} />
          <Route path="projects" element={<Projects />} />
          <Route path="stats" element={<Stats />} />
          <Route path="contact" element={<Contact />} />
        </Routes>
      </Layout>
    </ProfileProvider>
  );
};

function App() {
  // Get all profile IDs from the data
  // const profileIds = Object.keys(data.profiles);

  return (
    <Router>
      <Global styles={globalStyles} />
      <ProfileProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/maroti" replace />} />
          <Route path="/:profileId/*" element={<ProfileLayout />} />
          <Route path="/404" element={<NotFound />} />
        </Routes>
      </ProfileProvider>
    </Router>
  );
}

export default App;
