const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to the data.json file
const dataFilePath = path.join(__dirname, 'src', 'data', 'data.json');

// Get all profiles
app.get('/api/profiles', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    // Remove passwords from the response
    const profilesWithoutPasswords = Object.keys(data.profiles).reduce((acc, key) => {
      const { password, ...profileWithoutPassword } = data.profiles[key];
      acc[key] = profileWithoutPassword;
      return acc;
    }, {});
    res.json({ profiles: profilesWithoutPasswords });
  } catch (error) {
    console.error('Error reading profiles:', error);
    res.status(500).json({ error: 'Failed to read profiles' });
  }
});

// Get a specific profile
app.get('/api/profiles/:profileId', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const { profileId } = req.params;
    
    if (data.profiles[profileId]) {
      const { password, ...profileWithoutPassword } = data.profiles[profileId];
      res.json(profileWithoutPassword);
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    console.error('Error reading profile:', error);
    res.status(500).json({ error: 'Failed to read profile' });
  }
});

// Validate password for a profile
app.post('/api/profiles/:profileId/validate-password', (req, res) => {
  debugger
  try {
    const { profileId } = req.params;
    const { password } = req.body;
    
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    
    if (!data.profiles[profileId]) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    if (data.profiles[profileId].password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    localStorage.setItem(`profile_${profileId}_password`, password);
    res.json({ success: true });
  } catch (error) {
    console.error('Error validating password:', error);
    res.status(500).json({ error: 'Failed to validate password' });
  }
});

// Update a profile
app.put('/api/profiles/:profileId', (req, res) => {
  try {
    debugger;
    const { profileId } = req.params;
    const { password, ...updatedData } = req.body;
    
    // Read the current data
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    
    // Check if the profile exists
    if (!data.profiles[profileId]) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Validate password
    if (data.profiles[profileId].password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    // Update the profile with the new data
    if (updatedData.personalInfo) {
      data.profiles[profileId].personalInfo = {
        ...data.profiles[profileId].personalInfo,
        ...updatedData.personalInfo
      };
    }
    
    if (updatedData.socialLinks) {
      data.profiles[profileId].socialLinks = updatedData.socialLinks;
    }
    
    // Handle resume updates
    if (updatedData.resume) {
      if (!data.profiles[profileId].resume) {
        data.profiles[profileId].resume = {};
      }
      
      Object.keys(updatedData.resume).forEach(section => {
        data.profiles[profileId].resume[section] = updatedData.resume[section];
      });
    }
    
    // Write the updated data back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 