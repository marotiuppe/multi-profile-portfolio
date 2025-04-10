import React from 'react';
import defaultImage from '../assets/images/default-avatar.jpg';
import { useData } from '../context/dataContext';
import { useParams } from 'react-router-dom';

const Avatar = () => {
  const { profileId } = useParams();
  const { getProfileByProfileId } = useData();
  
  const profile = getProfileByProfileId(profileId);

  if (!profile) {
    return <div>Profile not available</div>;
  }

  // Import profile image directly
  let profileImage;
  try {
    profileImage = require(`../assets/images/${profile.personalInfo.profileImageName}`);
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