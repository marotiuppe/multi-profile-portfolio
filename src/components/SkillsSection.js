import React from 'react';
import { useData } from '../context/dataContext';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Chip } from '@mui/material';

const SkillsSection = () => {
  const { profileId } = useParams();
  const { getProfileByProfileId } = useData();
  const profile = getProfileByProfileId(profileId);

  if (!profile) {
    return null;
  }

  const { technicalExpertise } = profile.personalInfo;

  // Convert technicalExpertise object into array of skills
  const technicalSkills = Object.entries(technicalExpertise).reduce((acc, [category, skills]) => {
    const skillArray = skills.split(', ');
    return [...acc, ...skillArray];
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Technical Expertise
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {technicalSkills.map((skill, index) => (
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
      </Grid>
    </Box>
  );
};

export default SkillsSection;