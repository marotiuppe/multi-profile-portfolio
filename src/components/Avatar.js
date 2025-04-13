import React, { useEffect, useState } from 'react';
import defaultImage from '../assets/images/default-avatar.jpg';
import { useData } from '../context/dataContext';
import { useParams } from 'react-router-dom';

const Avatar = () => {
  const { profileId } = useParams();
  const { getProfileByProfileId } = useData();

  const [profile, setProfile] = useState(null);  
  const [loading, setLoading] = useState(true);  

  useEffect(() => {  
    const fetchProfile = async () => {  
      const fetchedProfile = await getProfileByProfileId(profileId);  
      setProfile(fetchedProfile);  
      setLoading(false);  
    };  
    
    fetchProfile();  
  }, [profileId, getProfileByProfileId]);  

  if (loading) {  
    return <div>Loading Avatar...</div>;  
  }

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