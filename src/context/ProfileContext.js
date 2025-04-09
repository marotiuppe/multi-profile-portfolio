import React, { createContext, useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import data from '../data/data.json';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const { profileId } = useParams();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState({ success: false, message: '' });

  useEffect(() => {
    setLoading(true);
    if (profileId && data.profiles[profileId]) {
      setCurrentProfile(data.profiles[profileId].status === 'active' ? data.profiles[profileId] : null);
      setError(null);
    } else {
      setError('Profile not found');
      setCurrentProfile(null);
    }
    setLoading(false);
  }, [profileId]);

  const updateProfile = async (updatedData) => {
    if (!currentProfile || !profileId) return;
    
    try {
      setUpdateStatus({ success: false, message: 'Updating profile...' });
      
      // Create a deep copy of the current profile
      const updatedProfile = JSON.parse(JSON.stringify(currentProfile));
      
      // Update the specific fields
      if (updatedData.personalInfo) {
        updatedProfile.personalInfo = {
          ...updatedProfile.personalInfo,
          ...updatedData.personalInfo
        };
      }
      
      if (updatedData.socialLinks) {
        updatedProfile.socialLinks = updatedData.socialLinks;
      }
      
      // Update the state immediately for a responsive UI
      setCurrentProfile(updatedProfile);
      
      // Send the update to the server
      const response = await fetch(`http://localhost:5000/api/profiles/${profileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...updatedData,password:localStorage.getItem(`profile_${profileId}_password`)}),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setUpdateStatus({ success: true, message: 'Profile updated successfully' });
      } else {
        setUpdateStatus({ success: false, message: result.error || 'Failed to update profile' });
        // Revert the state if the update failed
        setCurrentProfile(currentProfile);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateStatus({ success: false, message: 'Error updating profile' });
      // Revert the state if the update failed
      setCurrentProfile(currentProfile);
    }
  };

  const value = {
    currentProfile,
    loading,
    error,
    profileId,
    updateProfile,
    updateStatus
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext; 