import React from 'react';
import { useData } from '../context/dataContext';
import { Navigate, useParams } from 'react-router-dom';
import { Box, Typography, Grid, Paper } from '@mui/material';

const ProfileSection = () => {
  const { profileId } = useParams();
  const { getProfileByProfileId } = useData();
  const profile = getProfileByProfileId(profileId);

  if (!profile) {
    return <Navigate to="/404" replace />;
  }

  const { personalInfo, socialLinks } = profile;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Basic Information
            </Typography>
            <Typography variant="body1">
              <strong>Name:</strong> {personalInfo.fullName}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {personalInfo.email}
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> {personalInfo.phone}
            </Typography>
            <Typography variant="body1">
              <strong>Location:</strong> {personalInfo.location}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Professional Information
            </Typography>
            <Typography variant="body1">
              <strong>Title:</strong> {personalInfo.title}
            </Typography>
            <Typography variant="body1">
              <strong>Company:</strong> {personalInfo.company}
            </Typography>
            <Typography variant="body1">
              <strong>Experience:</strong> {personalInfo.experience}
            </Typography>
            <Typography variant="body1">
              <strong>About:</strong> {personalInfo.about}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Social Links
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(socialLinks).map(([platform, url]) => (
                <Grid item key={platform}>
                  <Typography variant="body1">
                    <strong>{platform}:</strong> {url}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileSection;