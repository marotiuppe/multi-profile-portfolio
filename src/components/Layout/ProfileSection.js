import React, { useState, useEffect } from 'react';
import './ProfileSection.css';
import SocialIcon from './SocialIcon';
import { useProfile } from '../../context/ProfileContext';
import Avatar from '../Avatar';

const ProfileSection = () => {
  const { currentProfile, loading, error, updateProfile, updateStatus } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    email: '',
    phone: '',
    about: '',
    socialLinks: []
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    if (updateStatus.message) {
      setStatusMessage(updateStatus.message);
      
      // Clear the status message after 3 seconds
      const timer = setTimeout(() => {
        setStatusMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [updateStatus]);

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

  const handleEditClick = () => {
    if (currentProfile) {
      setEditedData({
        email: currentProfile.personalInfo.email,
        phone: currentProfile.personalInfo.phone,
        about: currentProfile.personalInfo.about,
        socialLinks: [...currentProfile.socialLinks]
      });
      setIsEditing(true);
    }
  };

  const handleSaveClick = () => {
    updateProfile({
      personalInfo: {
        email: editedData.email,
        phone: editedData.phone,
        about: editedData.about
      },
      socialLinks: editedData.socialLinks
    });
    setIsEditing(false);
    setEditingField(null);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditingField(null);
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

  const handleFieldEdit = (field) => {
    if (currentProfile) {
      setEditedData({
        email: currentProfile.personalInfo.email,
        phone: currentProfile.personalInfo.phone,
        about: currentProfile.personalInfo.about,
        socialLinks: [...currentProfile.socialLinks]
      });
      setEditingField(field);
    }
  };

  const handleFieldSave = (field) => {
    updateProfile({
      personalInfo: {
        ...currentProfile.personalInfo,
        [field]: editedData[field]
      },
      socialLinks: currentProfile.socialLinks
    });
    setEditingField(null);
  };

  const handleFieldCancel = () => {
    setEditingField(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !currentProfile) {
    return <div>Error: {error || 'Profile not found'}</div>;
  }

  const { personalInfo, socialLinks } = currentProfile;
  const experience = calculateExperience(personalInfo.experienceStartDate);
  const aboutText = personalInfo.about.replace('{experience}', experience);

  return (
    <div className="profile-container">
      <span className="edit-icon" onClick={() => handleEditClick()}>
        <i className="fas fa-edit"></i>
      </span>
      {statusMessage && (
        <div className={`status-message ${updateStatus.success ? 'success' : 'error'}`}>
          {statusMessage}
        </div>
      )}
      
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
                  <button  className="remove-btn ms-1" onClick={() => removeSocialLink(index)} >
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
            <div className="edit-icon" onClick={() => handleFieldEdit('email')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            {editingField === 'email' && (
              <div className="inline-edit-field">
                <input
                  type="email"
                  name="email"
                  value={editedData.email}
                  onChange={handleInputChange}
                  autoFocus
                />
                <div className="inline-edit-actions">
                  <button onClick={() => handleFieldSave('email')}>Save</button>
                  <button onClick={handleFieldCancel}>Cancel</button>
                </div>
              </div>
            )}
          </div>
          
          {personalInfo.phone && (
            <div className="field-container">
              <a href={`tel:${personalInfo.phone}`} className="phone">
                {personalInfo.phone}
              </a>
              <div className="edit-icon" onClick={() => handleFieldEdit('phone')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              {editingField === 'phone' && (
                <div className="inline-edit-field">
                  <input
                    type="text"
                    name="phone"
                    value={editedData.phone}
                    onChange={handleInputChange}
                    autoFocus
                  />
                  <div className="inline-edit-actions">
                    <button onClick={() => handleFieldSave('phone')}>Save</button>
                    <button onClick={handleFieldCancel}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="section field-container">
            <h2 className="section-title">About</h2>
            <p className="section-text">{aboutText}</p>
            <div className="edit-icon" onClick={() => handleFieldEdit('about')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            {editingField === 'about' && (
              <div className="inline-edit-field about-edit">
                <textarea style={{width: '100%'}}
                  name="about"
                  value={editedData.about}
                  onChange={handleInputChange}
                  autoFocus
                  rows="5"
                  
                />
                <div className="inline-edit-actions">
                  <button onClick={() => handleFieldSave('about')}>Save</button>
                  <button onClick={handleFieldCancel}>Cancel</button>
                </div>
              </div>
            )}
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
    </div>
  );
};

export default ProfileSection; 