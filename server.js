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
    res.json(data);
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
      res.json(data.profiles[profileId]);
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    console.error('Error reading profile:', error);
    res.status(500).json({ error: 'Failed to read profile' });
  }
});

// Update a profile
app.put('/api/profiles/:profileId', (req, res) => {
  try {
    const { profileId } = req.params;
    const updatedData = req.body;
    
    // Read the current data
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    
    // Check if the profile exists
    if (!data.profiles[profileId]) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Update the profile with the new data
    // We're only updating specific fields, not replacing the entire profile
    if (updatedData.personalInfo) {
      data.profiles[profileId].personalInfo = {
        ...data.profiles[profileId].personalInfo,
        ...updatedData.personalInfo
      };
    }
    
    if (updatedData.socialLinks) {
      data.profiles[profileId].socialLinks = updatedData.socialLinks;
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