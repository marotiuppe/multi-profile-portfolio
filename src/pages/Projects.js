import React, { useState, useEffect } from "react";
import { useData } from "../context/dataContext";
import { useParams } from "react-router-dom";
import "./Projects.css";
import { usePassword } from "../context/PasswordContext";
import PasswordValidation from "../components/PasswordValidation";
import { FaEdit, FaPlus } from "react-icons/fa";

const Projects = () => {
  const { profileId } = useParams();
  const { getProfileByProfileId, updateData } = useData();
  const { isProfileValidated, validateProfile } = usePassword();
  const [profile, setProfile] = useState(null);
  const [editeProjectData, setEditeProjectData] = useState([]);
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const newProjectTemplate = {
    title: "",
    date: "",
    description: "",
    technologies: "",
    image: "",
    link: ""
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfileByProfileId(profileId);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, getProfileByProfileId]);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  useEffect(() => {
    if (isEditing && profile) {
      const { projects = [] } = profile;
      setEditeProjectData([...projects]);
    }
  }, [isEditing, profile]);

  useEffect(() => {
    if (editingProjectIndex !== null && profile) {
      const { projects = [] } = profile;
      setEditingProject(projects[editingProjectIndex]);
    }
  }, [editingProjectIndex, profile]);

  const handleEditClick = () => {
    if (profile) {
      setIsEditing(true);
    }
  };

  const handlePasswordValidation = (action) => {
    if (!isProfileValidated(profileId)) {
      setPendingAction(action);
      setShowPasswordModal(true);
      return false;
    }
    return true;
  };

  const handlePasswordSuccess = () => {
    validateProfile(profileId);
    if (pendingAction) {
      pendingAction();
    }
    setShowPasswordModal(false);
    setPendingAction(null);
  };

  const toggleEditMode = () => {
    if (handlePasswordValidation(() => setIsEditing(!isEditing))) {
      setIsEditing(!isEditing);
    }
  };

  const handleSaveClick = async () => {
    const updatedProfile = {
      ...profile,
      projects: editeProjectData,
    };

    try {
      const result = await updateData(profileId, updatedProfile);
      if (result.success !== false) {
        setProfile(updatedProfile);
        setStatusMessage('Profile updated successfully');
      } else {
        console.error('Failed to update profile:', result.error);
        setStatusMessage('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setStatusMessage('Error updating profile');
    }
    setIsEditing(false);
  };

  const handleProjectEdit = (index) => {
    setEditingProjectIndex(index);
    setEditingProject(editeProjectData[index]);
  };

  const handleProjectChange = (field, value) => {
    if (editingProjectIndex !== null) {
      setEditeProjectData(prev => {
        const newProjects = [...prev];
        newProjects[editingProjectIndex] = {
          ...newProjects[editingProjectIndex],
          [field]: value
        };
        return newProjects;
      });
    } else {
      setEditingProject(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddProject = () => {
    setEditeProjectData(prev => [...prev, newProjectTemplate]);
  };

  const handleRemoveProject = (index) => {
    setEditeProjectData(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditProject = (index) => {
    if (handlePasswordValidation(() => setEditingProjectIndex(index))) {
      setEditingProjectIndex(index);
      setIsEditingProject(true);
    }
  };

  const handleSaveProject = async () => {
    if (!editingProjectIndex) return;

    const updatedProjects = [...profile.projects];
    updatedProjects[editingProjectIndex] = editingProject;

    const updatedProfile = {
      ...profile,
      projects: updatedProjects
    };

    try {
      const result = await updateData(profileId, updatedProfile);
      if (result.success !== false) {
        setProfile(updatedProfile);
        setStatusMessage('Project updated successfully');
        setIsEditingProject(false);
        setEditingProjectIndex(null);
      } else {
        console.error('Failed to update project:', result.error);
        setStatusMessage('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setStatusMessage('Error updating project');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProject(false);
    setEditingProjectIndex(null);
  };

  const handleRemoveProjectAsync = async (index) => {
    if (handlePasswordValidation(async () => {
      const updatedProjects = profile.projects.filter((_, i) => i !== index);
      const updatedProfile = {
        ...profile,
        projects: updatedProjects
      };

      try {
        const result = await updateData(profileId, updatedProfile);
        if (result.success !== false) {
          setProfile(updatedProfile);
          setStatusMessage('Project removed successfully');
        } else {
          console.error('Failed to remove project:', result.error);
          setStatusMessage('Failed to remove project');
        }
      } catch (error) {
        console.error('Error removing project:', error);
        setStatusMessage('Error removing project');
      }
    })) {
      // Password validation successful, action will be handled by pendingAction
    }
  };

  const handleAddProjectAsync = () => {
    if (handlePasswordValidation(async () => {
      const newProject = {
        title: "",
        date: "",
        description: "",
        technologies: "",
        image: "",
        link: ""
      };

      const updatedProjects = [...profile.projects, newProject];
      const updatedProfile = {
        ...profile,
        projects: updatedProjects
      };

      try {
        const result = await updateData(profileId, updatedProfile);
        if (result.success !== false) {
          setProfile(updatedProfile);
          setStatusMessage('Project added successfully');
        } else {
          console.error('Failed to add project:', result.error);
          setStatusMessage('Failed to add project');
        }
      } catch (error) {
        console.error('Error adding project:', error);
        setStatusMessage('Error adding project');
      }
    })) {
      // Password validation successful, action will be handled by pendingAction
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  const { projects = [] } = profile;

  return (
    <div className="projects-container">
      <h1 className="projects-title">PROJECTS
        {!isEditing ? (
          <button onClick={toggleEditMode} className="project-edit-button">
            Edit
          </button>
        ) : (
          <div className="save-cancel-controls">
            <button onClick={handleSaveClick} className="project-save-button">
              Save
            </button>
            <button onClick={toggleEditMode} className="project-cancel-button">
              Cancel
            </button>
          </div>
        )}
      </h1>
      <p className="projects-subtitle">
        A SELECTION OF PROJECTS THAT I'M NOT TOO ASHAMED OF
      </p>

      {isEditing ? (
        <div className="projects-edit-container">
          <div className="projects-edit-grid">
            {editeProjectData.map((project, index) => (
              <div key={index} className="project-edit-card">
                <div className="project-edit-header">
                  <h3>{project.title}</h3>
                  <button 
                    onClick={() => handleRemoveProject(index)} 
                    className="remove-project-btn"
                  >
                    Remove
                  </button>
                </div>
                <div className="project-edit-form">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={project.title}
                      onChange={(e) => handleProjectChange('title', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="text"
                      placeholder="Date"
                      value={project.date}
                      onChange={(e) => handleProjectChange('date', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Project Description"
                      value={project.description}
                      onChange={(e) => handleProjectChange('description', e.target.value)}
                      className="form-textarea"
                    />
                  </div>
                  <div className="form-group">
                    <label>Technologies</label>
                    <input
                      type="text"
                      placeholder="Technologies used"
                      value={project.technologies}
                      onChange={(e) => handleProjectChange('technologies', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={project.image}
                      onChange={(e) => handleProjectChange('image', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Project Link</label>
                    <input
                      type="text"
                      placeholder="Project Link"
                      value={project.link}
                      onChange={(e) => handleProjectChange('link', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="projects-display-container">
          {projects.map((project, index) => (
            <div key={index} className="project-item">
              {isEditingProject && editingProjectIndex === index ? (
                <div className="project-edit-form">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={editingProject.title}
                      onChange={(e) => handleProjectChange('title', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="text"
                      value={editingProject.date}
                      onChange={(e) => handleProjectChange('date', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={editingProject.description}
                      onChange={(e) => handleProjectChange('description', e.target.value)}
                      className="form-textarea"
                    />
                  </div>
                  <div className="form-group">
                    <label>Technologies</label>
                    <input
                      type="text"
                      value={editingProject.technologies}
                      onChange={(e) => handleProjectChange('technologies', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      value={editingProject.image}
                      onChange={(e) => handleProjectChange('image', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Project Link</label>
                    <input
                      type="text"
                      value={editingProject.link}
                      onChange={(e) => handleProjectChange('link', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="project-edit-actions">
                    <button onClick={handleSaveProject} className="save-btn">
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="project-display">
                  <div className="project-header">
                    <h2>{project.title}</h2>
                    <div className="project-actions">
                    <p>{project.date}</p>
                      <button onClick={() => handleEditProject(index)} className="edit-button">
                        <FaEdit />
                      </button>
                    </div>
                    
                  </div>
                  <p className="project-description">{project.description}</p>
                  <p className="project-technologies">Technologies: {project.technologies}</p>
                  {project.image && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" >
                      <div className="project-image-wrapper">
                        <img src={require(`../assets/images/${project.image}`)}  alt={project.title} className="project-image" />
                        <div className="project-image-overlay">
                          <span>Live Demo</span>
                        </div>
                        <style>{`
                          .project-image-wrapper {
                            position: relative;
                          }
                          .project-image-overlay {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background-color: rgba(0, 0, 0, 0.5);
                            color: white;
                            font-size: 1.2rem;
                            opacity: 0;
                            transition: opacity 0.3s ease;
                          }
                          .project-image-wrapper:hover .project-image-overlay {
                            opacity: 1;
                          }
                          .project-image-wrapper:hover .project-image {
                            filter: blur(5px);
                          }
                        `}</style>
                      </div>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="add-project-container">
        <button onClick={handleAddProjectAsync} className="add-project-btn">
          <FaPlus /> Add New Project
        </button>
      </div>

      {statusMessage && (
        <div className="status-message">
          {statusMessage}
        </div>
      )}

      <PasswordValidation
        show={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPendingAction(null);
        }}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
};

export default Projects;
