import React, { createContext, useContext } from 'react';  

const DataContext = createContext();  
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';  

export const DataProvider = ({ children }) => {  
  const getProfileByProfileId = async (profileId) => {  
    try {  
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`);  
      if (!response.ok) {  
        throw new Error('Profile not found');  
      }  
      const data = await response.json();
      return data.profile;  
    } catch (error) {  
      console.error('Error getting profile:', error);  
      return null;  
    }  
  };  

  const updateData = async (profileId, updatedData) => {  
    try {  
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {  
        method: 'PUT',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify(updatedData),  
      });  

      if (!response.ok) {  
        throw new Error('Failed to update data');  
      }  

      const result = await response.json(); 
      return result;  
    } catch (error) {  
      console.error('Error updating data:', error);  
      return { success: false, error: error.message };  
    }  
  };  

  const validatePassword = async (profileId, password) => {  
    try {  
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}/validate-password`, {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({ password }),  
      });  

      if (!response.ok) {  
        const error = await response.json();  
        throw new Error(error.error || 'Failed to validate password');  
      }  

      const result = await response.json();  
      return result;  
    } catch (error) {  
      console.error('Error validating password:', error);  
      return { success: false, error: error.message };  
    }  
  };  

  return (  
    <DataContext.Provider value={{ getProfileByProfileId, updateData, validatePassword }}>  
      {children}  
    </DataContext.Provider>  
  );  
};  

export const useData = () => {  
  const context = useContext(DataContext);  
  if (!context) {  
    throw new Error('useData must be used within a DataProvider');  
  }  
  return context;  
};  

export default DataContext;  