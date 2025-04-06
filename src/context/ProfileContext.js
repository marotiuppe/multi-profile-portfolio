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

  const value = {
    currentProfile,
    loading,
    error,
    profileId
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext; 