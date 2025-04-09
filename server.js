const express = require('express');
const cors = require('cors');
const path = require('path');
const data = require('./src/data/data.json');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/profiles', (req, res) => {
  res.json(data.profiles);
});

app.get('/api/profiles/:id', (req, res) => {
  const profile = data.profiles[req.params.id];
  if (profile) {
    res.json(profile);
  } else {
    res.status(404).json({ error: 'Profile not found' });
  }
});

app.put('/api/profiles/:id', (req, res) => {
  const profileId = req.params.id;
  const updatedProfile = req.body;
  
  if (data.profiles[profileId]) {
    // Update the profile in the data object
    data.profiles[profileId] = {
      ...data.profiles[profileId],
      ...updatedProfile
    };
    
    // Here you would typically save to a database
    // For now, we'll just send a success response
    res.json({ message: 'Profile updated successfully' });
  } else {
    res.status(404).json({ error: 'Profile not found' });
  }
});

// Export the Express API
module.exports = app; 