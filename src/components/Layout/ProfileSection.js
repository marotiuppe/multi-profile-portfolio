import React from 'react';
import './ProfileSection.css';
import SocialIcon from './SocialIcon';
import { useProfile } from '../../context/ProfileContext';
import Avatar from '../Avatar';

const ProfileSection = () => {
  const { currentProfile, loading, error } = useProfile();

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

  if (loading) {
    return;
  }

  if (error || !currentProfile) {
    return;
  }

  const { personalInfo, socialLinks } = currentProfile;
  const experience = calculateExperience(personalInfo.experienceStartDate);
  const aboutText = personalInfo.about.replace('{experience}', experience);

  return (
    <div className="profile-container">
      <div className="avatar-container">
        <Avatar/>
      </div>
      <div className="name-container">
        <h2 className="full-name">{personalInfo.fullName}</h2>
      </div>
      <a href={`mailto:${personalInfo.email}`} className="email">
        {personalInfo.email.toUpperCase()}
      </a>
      <hr className="divider" />
      <div className="section">
        <h2 className="section-title">About</h2>
        <p className="section-text">{aboutText}</p>
      </div>
      <div className="social-links">
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <SocialIcon type={social.type} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProfileSection; 