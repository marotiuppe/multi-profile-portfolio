import React from 'react';
import { useProfile } from '../context/ProfileContext';
import { Box, Typography, Grid, Paper, Chip } from '@mui/material';

const SkillsSection = () => {
  const { currentProfile } = useProfile();
  
  if (!currentProfile) {
    return null;
  }

  const { technicalExpertise, softSkills } = currentProfile.personalInfo;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Technical Expertise
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {technicalExpertise.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Soft Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {softSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SkillsSection; 