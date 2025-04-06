import React from 'react';
import './About.css';
import { useProfile } from '../context/ProfileContext';

const About = () => {
  const { currentProfile } = useProfile();
  const { personalInfo } = currentProfile;

  const calculateExperience = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    
    let years = today.getFullYear() - start.getFullYear();
    let months = today.getMonth() - start.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years === 0) {
      return `${months} months`;
    } else if (years === 1) {
      return months === 0 
        ? '1 year' 
        : `1 year ${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      return months === 0 
        ? `${years} years` 
        : `${years} years ${months} ${months === 1 ? 'month' : 'months'}`;
    }
  };

  const experience = calculateExperience(personalInfo.experienceStartDate);
  
  // Replace {experience} placeholder in the about text with actual experience
  const aboutText = personalInfo.about.replace('{experience}', experience);

  return (
    <div className="about-container">
      <h1 className="about-title">ABOUT ME</h1>
      <p className="last-updated">(UPDATED MAY 2024)</p>

      <section className="about-section">
        <h2 className="section-title">INTRO</h2>
        <p>
          {aboutText}
        </p>
      </section>

      <section className="about-section">
        <h2 className="section-title">PERSONAL BACKGROUND</h2>
        <p>
          {personalInfo.personalBackground}
        </p>
      </section>

      <section className="about-section">
        <h2 className="section-title">SOME HISTORY</h2>
        <ul className="history-list">
          {personalInfo.history.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="about-section">
        <h2 className="section-title">TECHNICAL EXPERTISE</h2>
        <ul className="expertise-list">
          {Object.entries(personalInfo.technicalExpertise).map(([category, skills]) => (
            <li key={category}>
              <strong>{category}:</strong> {skills}
            </li>
          ))}
        </ul>
      </section>

      <section className="about-section">
        <h2 className="section-title">CURRENT FOCUS</h2>
        <ul className="focus-list">
          {personalInfo.currentFocus.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="about-section">
        <h2 className="section-title">I DREAM OF</h2>
        <ul className="dreams-list">
          {personalInfo.dreams.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
      
      <section className="about-section">
        <h2 className="section-title">FUN FACTS</h2>
        <ul className="fun-list">
          {personalInfo.funFacts.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default About; 