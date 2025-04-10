import React, { useState, useEffect } from 'react';
import './ProfileSection.css';
import SocialIcon from './SocialIcon';
import { useData } from '../../context/dataContext';
import { useParams } from 'react-router-dom';
import Avatar from '../Avatar';

const ProfileSection = () => {
  const { profileId } = useParams();
  const { getProfileByProfileId, updateData } = useData();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [editedData, setEditedData] = useState({
    email: '',
    phone: '',
    about: '',
    socialLinks: []
  });

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

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const calculateExperience = (startDate) => {
    if (!startDate) return ''; // Add null check for startDate
    
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

  const handleEditClick = () => {
    if (profile) {
      setEditedData({
        email: profile.personalInfo.email,
        phone: profile.personalInfo.phone,
        about: profile.personalInfo.about,
        socialLinks: [...profile.socialLinks]
      });
      setIsEditing(true);
    }
  };

  const handleSaveClick = async () => {
    const updatedProfile = {
      ...profile,
      personalInfo: {
        ...profile.personalInfo,
        email: editedData.email,
        phone: editedData.phone,
        about: editedData.about
      },
      socialLinks: editedData.socialLinks
    };

    try {
      const result = await updateData(profileId, updatedProfile);
      if (result.success !== false) {
        setProfile(updatedProfile);
        setStatusMessage('Profile updated successfully');
      } else {
        console.error('Failed to update profile:', result.error);
        setStatusMessage('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setStatusMessage('Error updating profile');
    }
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedSocialLinks = [...editedData.socialLinks];
    updatedSocialLinks[index] = {
      ...updatedSocialLinks[index],
      [field]: value
    };
    setEditedData(prev => ({
      ...prev,
      socialLinks: updatedSocialLinks
    }));
  };

  const addSocialLink = () => {
    setEditedData(prev => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { type: 'linkedin', url: '', label: '' }
      ]
    }));
  };

  const removeSocialLink = (index) => {
    setEditedData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  if (!profile || !profile.personalInfo) {
    return <div>Loading profile...</div>;
  }

  const { personalInfo, socialLinks } = profile;
  const experience = calculateExperience(personalInfo.experienceStartDate);
  const aboutText = personalInfo.about ? personalInfo.about.replace('{experience}', experience) : '';

  return (
    <div className="profile-container">
      <span className="edit-icon" onClick={() => handleEditClick()}>
        <i className="fas fa-edit"></i>
      </span>
      
      <div className="avatar-container">
        <Avatar/>
      </div>
      
      <div className="name-container">
        <h2 className="full-name">{personalInfo.fullName}</h2>
      </div>

      {isEditing ? (
        <>
          <div className="edit-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="edit-field">
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={editedData.phone}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="edit-field">
            <label htmlFor="about">About:</label>
            <textarea
              id="about"
              name="about"
              value={editedData.about}
              onChange={handleInputChange}
              rows="5"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div className="social-links-edit">
            <h3>Social Links</h3>
            {editedData.socialLinks.map((social, index) => (
              <div key={index} className="social-link-edit">
                <div className="edit-field">
                  <label htmlFor={`social-type-${index}`}>Type:</label>
                  <select
                    id={`social-type-${index}`}
                    value={social.type}
                    onChange={(e) => handleSocialLinkChange(index, 'type', e.target.value)}
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="github">GitHub</option>
                    <option value="twitter">Twitter</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                  </select>
                </div>
                <div className="edit-field">
                  <label htmlFor={`social-url-${index}`}>URL:</label>
                  <div className="d-flex">
                  <input
                    type="text"
                    id={`social-url-${index}`}
                    value={social.url}
                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                  />
                  <button className="remove-btn ms-1" onClick={() => removeSocialLink(index)}>
                    Remove
                  </button>
                  </div>
                </div>
              </div>
            ))}
            <button className="add-btn" onClick={addSocialLink}>
              Add Social Link
            </button>
          </div>
          
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSaveClick}>Save</button>
            <button className="cancel-btn" onClick={handleCancelClick}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <div className="field-container">
            <a href={`mailto:${personalInfo.email}`} className="email">
              {personalInfo.email.toUpperCase()}
            </a>
          </div>
          
          {personalInfo.phone && (
            <div className="field-container">
              <a href={`tel:${personalInfo.phone}`} className="phone">
                {personalInfo.phone}
              </a>
            </div>
          )}
          
          <div className="section field-container">
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
          
        <button style={{alignItems: 'right'}} className="edit-btn" onClick={handleEditClick}>
          Edit Profile
        </button>
        </>
      )}

      {statusMessage && (
        <div className={`status-message ${statusMessage.includes('success') ? 'success' : 'error'}`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default ProfileSection;