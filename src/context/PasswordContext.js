import React, { createContext, useState, useContext } from 'react';

const PasswordContext = createContext();

export const PasswordProvider = ({ children }) => {
  const [validatedProfiles, setValidatedProfiles] = useState({});

  const validateProfile = (profileId) => {
    setValidatedProfiles(prev => ({
      ...prev,
      [profileId]: true
    }));
  };

  const isProfileValidated = (profileId) => {
    return validatedProfiles[profileId] || false;
  };

  return (
    <PasswordContext.Provider value={{ validateProfile, isProfileValidated }}>
      {children}
    </PasswordContext.Provider>
  );
};

export const usePassword = () => {
  const context = useContext(PasswordContext);
  if (!context) {
    throw new Error('usePassword must be used within a PasswordProvider');
  }
  return context;
}; 