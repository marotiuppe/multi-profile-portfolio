import React from 'react';
import defaultImage from '../assets/images/default-avatar.jpg';
import { useProfile } from '../context/ProfileContext';

const Avatar = () => {
  const { currentProfile, loading, error } = useProfile();
  if (loading) {
    return <div>Loading profile...</div>;
  }
  if (error || !currentProfile) {
    return <div>Profile not available</div>;
  }

  // Import profile image directly
  let profileImage;
  try {
    profileImage = require(`../assets/images/${currentProfile.personalInfo.profileImageName}`);
  } catch (err) {
    profileImage = defaultImage;
  }

  // Use the imported image or fallback to default
  return <img 
    src={profileImage} 
    alt="Profile" 
    className="profile-image"
  />;
};

export default Avatar; 