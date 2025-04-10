import React, { useState, useEffect } from "react";
import { useData } from "../context/dataContext";
import { useParams } from "react-router-dom";
import "./Projects.css";

const Projects = () => {
  const { profileId } = useParams();
  const { getProfileByProfileId } = useData();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfileByProfileId(profileId);
        setCurrentProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, getProfileByProfileId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentProfile) {
    return <div>Profile not found</div>;
  }

  const { projects } = currentProfile;

  return (
    <div className="projects-container">
      {projects && projects.length > 0 && (
        <>
          <h1 className="projects-title">PROJECTS</h1>
          <p className="projects-subtitle">
            A SELECTION OF PROJECTS THAT I'M NOT TOO ASHAMED OF
          </p>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-header">
                  <h2>{project.title}</h2>
                  <span className="project-date">{project.date}</span>
                </div>

                <div className="project-image-container">
                  {project.image && (
                    <img
                      src={require(`../assets/images/${project.image}`)}
                      alt={project.title}
                      className="project-image"
                    />
                  )}
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-technologies">
                  <h3>Technologies Used:</h3>
                  <p>{project.technologies}</p>
                </div>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    View Project
                  </a>
                )}
              </div>
            ))}
            {projects.length === 0 && (
              <div className="no-projects">
                <h2>No projects available</h2>
                <p>Check back later for updates!</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Projects;
