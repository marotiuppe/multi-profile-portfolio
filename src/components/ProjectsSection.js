import React from 'react';
import { useData } from '../context/dataContext';
import { Navigate, useParams } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip } from '@mui/material';

const ProjectsSection = () => {
  const { profileId } = useParams();
  const { getProfileByProfileId } = useData();
  const profile = getProfileByProfileId(profileId);
  
  if (!profile) {
    return <Navigate to="/404" replace />;
  }

  const { projects } = profile.professionalInfo;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <Grid container spacing={3}>
        {projects.map((project, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {project.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {project.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {project.technologies.map((tech, techIndex) => (
                    <Chip
                      key={techIndex}
                      label={tech}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Role: {project.role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {project.duration}
                </Typography>
              </CardContent>
              <CardActions>
                {project.githubUrl && (
                  <Button
                    size="small"
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                  </Button>
                )}
                {project.demoUrl && (
                  <Button
                    size="small"
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Demo
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectsSection;