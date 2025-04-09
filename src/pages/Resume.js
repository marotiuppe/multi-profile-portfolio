import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import './Resume.css';
import Avatar from '../components/Avatar';
import { useProfile } from '../context/ProfileContext';
import { usePassword } from '../context/PasswordContext';
import PasswordValidation from '../components/PasswordValidation';
import { useParams } from 'react-router-dom';

const calculateDuration = (startDate, endDate = new Date()) => {
  const start = new Date(startDate);
  const end = endDate === 'present' ? new Date() : new Date(endDate);
  
  const yearDiff = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  
  let totalMonths = (yearDiff * 12) + monthDiff;
  
  if (totalMonths >= 12) {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return `${years} yr${years > 1 ? 's' : ''} ${months > 0 ? `${months} mos` : ''}`;
  }
  return `${totalMonths} mos`;
};

const Resume = () => {
  const resumeRef = useRef(null);
  const { profileId } = useParams();
  const { currentProfile, updateProfile, updateStatus } = useProfile();
  const { isProfileValidated, validateProfile } = usePassword();
  const { personalInfo = {}, resume = {} } = currentProfile || {};
  const { experiences = [], projects = [], education = [], skills = {}, socialLinks = [] } = resume;
  
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  
  // States for edited data
  const [editedExperiences, setEditedExperiences] = useState([]);
  const [editedProjects, setEditedProjects] = useState([]);
  const [editedEducation, setEditedEducation] = useState([]);
  const [editedSkills, setEditedSkills] = useState({});
  const [editedPersonalInfo, setEditedPersonalInfo] = useState({});
  const [editedSocialLinks, setEditedSocialLinks] = useState([]);
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  
  // State for editing contact info and social links
  const [isEditingContactInfo, setIsEditingContactInfo] = useState(false);
  const [editingSocialLinkIndex, setEditingSocialLinkIndex] = useState(null);
  const [newSocialLink, setNewSocialLink] = useState({ name: '', url: '', icon: '' });
  
  // New item templates
  const newExperienceTemplate = {
    company: '',
    startDate: '',
    endDate: '',
    position: '',
    location: '',
    workType: 'On-site',
    technologies: ''
  };
  
  const newProjectTemplate = {
    name: '',
    startDate: '',
    endDate: '',
    technologies: ''
  };
  
  const newEducationTemplate = {
    degree: '',
    school: '',
    startDate: '',
    endDate: '',
    grade: '',
    location: ''
  };
  
  useEffect(() => {
    if (updateStatus.message) {
      setStatusMessage(updateStatus.message);
      
      // Clear the status message after 3 seconds
      const timer = setTimeout(() => {
        setStatusMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [updateStatus]);
  
  // Initialize edited data when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditedExperiences([...experiences]);
      setEditedProjects([...projects]);
      setEditedEducation([...education]);
      setEditedSkills({...skills});
      setEditedPersonalInfo({...personalInfo});
      // Initialize socialLinks
      setEditedSocialLinks([...socialLinks]);
    }
  }, [isEditing, experiences, projects, education, skills, personalInfo, socialLinks]);
  
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

  const togglePersonalInfoEdit = () => {
    if (handlePasswordValidation(() => setIsEditingPersonalInfo(!isEditingPersonalInfo))) {
      setIsEditingPersonalInfo(!isEditingPersonalInfo);
    }
  };

  const toggleContactInfoEdit = () => {
    if (handlePasswordValidation(() => setIsEditingContactInfo(!isEditingContactInfo))) {
      setIsEditingContactInfo(!isEditingContactInfo);
    }
  };
  
  // Handlers for experiences
  const handleEditExperience = (index) => {
    if (handlePasswordValidation(() => {
      setEditingSection('experiences');
      setEditingItemIndex(index);
    })) {
      setEditingSection('experiences');
      setEditingItemIndex(index);
    }
  };
  
  const handleAddExperience = () => {
    if (handlePasswordValidation(() => {
      setEditedExperiences([...editedExperiences, { ...newExperienceTemplate }]);
      setEditingSection('experiences');
      setEditingItemIndex(editedExperiences.length);
    })) {
      setEditedExperiences([...editedExperiences, { ...newExperienceTemplate }]);
      setEditingSection('experiences');
      setEditingItemIndex(editedExperiences.length);
    }
  };
  
  const handleDeleteExperience = (index) => {
    const updatedExperiences = [...editedExperiences];
    updatedExperiences.splice(index, 1);
    setEditedExperiences(updatedExperiences);
  };
  
  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...editedExperiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    setEditedExperiences(updatedExperiences);
  };
  
  // Handlers for projects
  const handleEditProject = (index) => {
    setEditingSection('projects');
    setEditingItemIndex(index);
  };
  
  const handleAddProject = () => {
    setEditedProjects([...editedProjects, { ...newProjectTemplate }]);
    setEditingSection('projects');
    setEditingItemIndex(editedProjects.length);
  };
  
  const handleDeleteProject = (index) => {
    const updatedProjects = [...editedProjects];
    updatedProjects.splice(index, 1);
    setEditedProjects(updatedProjects);
  };
  
  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...editedProjects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value
    };
    setEditedProjects(updatedProjects);
  };
  
  // Handlers for education
  const handleEditEducation = (index) => {
    setEditingSection('education');
    setEditingItemIndex(index);
  };
  
  const handleAddEducation = () => {
    setEditedEducation([...editedEducation, { ...newEducationTemplate }]);
    setEditingSection('education');
    setEditingItemIndex(editedEducation.length);
  };
  
  const handleDeleteEducation = (index) => {
    const updatedEducation = [...editedEducation];
    updatedEducation.splice(index, 1);
    setEditedEducation(updatedEducation);
  };
  
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...editedEducation];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setEditedEducation(updatedEducation);
  };
  
  // Handlers for skills
  const handleEditSkills = (category) => {
    setEditingSection('skills');
    setEditingItemIndex(category);
  };
  
  const handleAddSkillCategory = () => {
    const categoryName = prompt('Enter the name of the new skill category:');
    if (categoryName && categoryName.trim() !== '') {
      setEditedSkills({
        ...editedSkills,
        [categoryName]: []
      });
    }
  };
  
  const handleDeleteSkillCategory = (category) => {
    const updatedSkills = { ...editedSkills };
    delete updatedSkills[category];
    setEditedSkills(updatedSkills);
  };
  
  const handleAddSkill = (category) => {
    const updatedSkills = { ...editedSkills };
    updatedSkills[category] = [
      ...updatedSkills[category],
      { name: '', level: 75 }
    ];
    setEditedSkills(updatedSkills);
  };
  
  const handleDeleteSkill = (category, index) => {
    const updatedSkills = { ...editedSkills };
    updatedSkills[category] = updatedSkills[category].filter((_, i) => i !== index);
    setEditedSkills(updatedSkills);
  };
  
  const handleSkillChange = (category, index, field, value) => {
    const updatedSkills = { ...editedSkills };
    updatedSkills[category][index] = {
      ...updatedSkills[category][index],
      [field]: field === 'level' ? parseInt(value, 10) : value
    };
    setEditedSkills(updatedSkills);
  };
  
  // Handler for personal info field changes
  const handlePersonalInfoChange = (field, value) => {
    setEditedPersonalInfo({
      ...editedPersonalInfo,
      [field]: value
    });
  };
  
  // Handler for adding a new social link
  const handleAddSocialLink = () => {
    if (newSocialLink.name && newSocialLink.url && newSocialLink.icon) {
      setEditedSocialLinks([...editedSocialLinks, { ...newSocialLink }]);
      setNewSocialLink({ name: '', url: '', icon: '' });
    }
  };
  
  // Handler for updating a social link
  const handleSocialLinkChange = (index, field, value) => {
    const updatedSocialLinks = [...editedSocialLinks];
    updatedSocialLinks[index] = {
      ...updatedSocialLinks[index],
      [field]: value
    };
    setEditedSocialLinks(updatedSocialLinks);
  };
  
  // Handler for removing a social link
  const handleDeleteSocialLink = (index) => {
    const updatedSocialLinks = [...editedSocialLinks];
    updatedSocialLinks.splice(index, 1);
    setEditedSocialLinks(updatedSocialLinks);
  };
  
  // Function to save all changes
  const handleSaveResume = () => {
    updateProfile({
      personalInfo: editedPersonalInfo,
      resume: {
        experiences: editedExperiences,
        projects: editedProjects,
        education: editedEducation,
        skills: editedSkills,
        socialLinks: editedSocialLinks
      }
    });
    setIsEditing(false);
    setEditingSection(null);
    setEditingItemIndex(null);
    setIsEditingPersonalInfo(false);
    setIsEditingContactInfo(false);
    setEditingSocialLinkIndex(null);
  };
  
  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditingItemIndex(null);
  };

  const downloadPDF = () => {
    const element = resumeRef.current;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${personalInfo.fullName} Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait'
      },
      pagebreak: { 
        mode: 'avoid-all',
        avoid: [
          '.education-item', 
          '.experience-item', 
          '.skill-category',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
        ]
      }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <>
      <PasswordValidation
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
        profileId={profileId}
      />
      <div className="resume-controls">
        <button onClick={downloadPDF} className="download-button">
          Download Resume
        </button>
        {!isEditing ? (
          <button onClick={toggleEditMode} className="edit-btn">
            Edit Resume
          </button>
        ) : (
          <>
            <button onClick={handleSaveResume} className="save-btn">
              Save Resume
            </button>
            <button onClick={toggleEditMode} className="cancel-btn">
              Cancel
            </button>
          </>
        )}
      </div>
      
      {statusMessage && (
        <div className={`status-message ${updateStatus.success ? 'success' : 'error'}`}>
          {statusMessage}
        </div>
      )}
      
      <div ref={resumeRef} className={`resume-container ${isEditing ? 'edit-mode' : ''}`}>
        <div className="resume-header">
          <div className="profile-section">
            <Avatar/>
            {isEditing ? (
              isEditingContactInfo ? (
                <div className="edit-form contact-info-form">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={editedPersonalInfo.email || ''}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      value={editedPersonalInfo.phone || ''}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      value={editedPersonalInfo.location || ''}
                      onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                    />
                  </div>
                  <div className="item-actions">
                    <button className="cancel-btn" onClick={toggleContactInfoEdit}>Cancel</button>
                    <button className="save-btn" onClick={toggleContactInfoEdit}>Done</button>
                  </div>
                </div>
              ) : (
                <div className="contact-info">
                  <div className="item-edit-header">
                    <div className="item-edit-title">Contact Information</div>
                    <div className="item-edit-actions">
                      <i className="fas fa-edit edit-action-icon" onClick={toggleContactInfoEdit}></i>
                    </div>
                  </div>
                  <p><i className="fas fa-envelope"></i> {editedPersonalInfo.email}</p>
                  <p><i className="fas fa-phone"></i> {editedPersonalInfo.phone}</p>
                  <p><i className="fas fa-map-marker-alt"></i> {editedPersonalInfo.location}</p>
                </div>
              )
            ) : (
              <div className="contact-info">
                <p><i className="fas fa-envelope"></i> {personalInfo.email}</p>
                <p><i className="fas fa-phone"></i> {personalInfo.phone}</p>
                <p><i className="fas fa-map-marker-alt"></i> {personalInfo.location}</p>
              </div>
            )}
            
            {isEditing ? (
              <div className="edit-social-links">
                <div className="item-edit-header">
                  <div className="item-edit-title">Social Links</div>
                  <div className="item-edit-actions">
                    <i className="fas fa-plus add-action-icon" title="Add Social Link" onClick={() => setEditingSocialLinkIndex('new')}></i>
                  </div>
                </div>
                
                {editingSocialLinkIndex === 'new' && (
                  <div className="edit-form social-link-form">
                    <div className="form-group">
                      <label htmlFor="social-name">Platform Name</label>
                      <input
                        type="text"
                        id="social-name"
                        value={newSocialLink.name}
                        onChange={(e) => setNewSocialLink({...newSocialLink, name: e.target.value})}
                        placeholder="LinkedIn, GitHub, etc."
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="social-url">URL</label>
                      <input
                        type="url"
                        id="social-url"
                        value={newSocialLink.url}
                        onChange={(e) => setNewSocialLink({...newSocialLink, url: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="social-icon">Icon Class</label>
                      <input
                        type="text"
                        id="social-icon"
                        value={newSocialLink.icon}
                        onChange={(e) => setNewSocialLink({...newSocialLink, icon: e.target.value})}
                        placeholder="fab fa-linkedin"
                      />
                    </div>
                    <div className="item-actions">
                      <button className="cancel-btn" onClick={() => setEditingSocialLinkIndex(null)}>Cancel</button>
                      <button className="save-btn" onClick={() => {
                        handleAddSocialLink();
                        setEditingSocialLinkIndex(null);
                      }}>Add</button>
                    </div>
                  </div>
                )}
                
                {editedSocialLinks && editedSocialLinks.length > 0 ? (
                  <div className="social-links">
                    {editedSocialLinks.map((link, index) => (
                      <div key={index} className="social-link-item">
                        {editingSocialLinkIndex === index ? (
                          <div className="edit-form social-link-form">
                            <div className="form-group">
                              <label htmlFor={`social-name-${index}`}>Platform Name</label>
                              <input
                                type="text"
                                id={`social-name-${index}`}
                                value={link.name}
                                onChange={(e) => handleSocialLinkChange(index, 'name', e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor={`social-url-${index}`}>URL</label>
                              <input
                                type="url"
                                id={`social-url-${index}`}
                                value={link.url}
                                onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor={`social-icon-${index}`}>Icon Class</label>
                              <input
                                type="text"
                                id={`social-icon-${index}`}
                                value={link.icon}
                                onChange={(e) => handleSocialLinkChange(index, 'icon', e.target.value)}
                              />
                            </div>
                            <div className="item-actions">
                              <button className="cancel-btn" onClick={() => setEditingSocialLinkIndex(null)}>Cancel</button>
                              <button className="save-btn" onClick={() => setEditingSocialLinkIndex(null)}>Done</button>
                            </div>
                          </div>
                        ) : (
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title={link.name}
                            className="social-link-edit"
                          >
                            <i className={link.icon}></i>
                            <div className="social-link-actions">
                              <i className="fas fa-edit edit-action-icon" onClick={(e) => {
                                e.preventDefault();
                                setEditingSocialLinkIndex(index);
                              }}></i>
                              <i className="fas fa-trash-alt edit-action-icon" onClick={(e) => {
                                e.preventDefault();
                                handleDeleteSocialLink(index);
                              }}></i>
                            </div>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-links-message">No social links added</p>
                )}
              </div>
            ) : (
              socialLinks && socialLinks.length > 0 && (
                <div className="social-links">
                  {socialLinks.map((link, index) => (
                    <a 
                      key={index} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title={link.name}
                    >
                      <i className={link.icon}></i>
                    </a>
                  ))}
                </div>
              )
            )}
          </div>
          
          <div className="main-content">
            <h1>{personalInfo.fullName}</h1>
            <div className="horizontal-divider"></div>
            {isEditing ? (
              isEditingPersonalInfo ? (
                <div className="edit-form personal-info-form">
                  <div className="form-group">
                    <label htmlFor="positionTitle">Position Title</label>
                    <input
                      type="text"
                      id="positionTitle"
                      value={editedPersonalInfo.positionTitle || ''}
                      onChange={(e) => handlePersonalInfoChange('positionTitle', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="tagline">Tagline</label>
                    <input
                      type="text"
                      id="tagline"
                      value={editedPersonalInfo.tagline || ''}
                      onChange={(e) => handlePersonalInfoChange('tagline', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="summary">Summary</label>
                    <textarea
                      id="summary"
                      rows="4"
                      value={editedPersonalInfo.summary || ''}
                      onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                    />
                  </div>
                  <div className="item-actions">
                    <button className="cancel-btn" onClick={togglePersonalInfoEdit}>Cancel</button>
                    <button className="save-btn" onClick={togglePersonalInfoEdit}>Done</button>
                  </div>
                </div>
              ) : (
                <div className="personal-info-display">
                  <div className="item-edit-header">
                    <div>
                      <h6 className="position-title">{editedPersonalInfo.positionTitle}</h6>
                      <h6 className="tagline">{editedPersonalInfo.tagline}</h6>
                    </div>
                    <div className="item-edit-actions">
                      <i className="fas fa-edit edit-action-icon" onClick={togglePersonalInfoEdit}></i>
                    </div>
                  </div>
                  <p className="summary">
                    {editedPersonalInfo.summary}
                  </p>
                </div>
              )
            ) : (
              <>
                <h6 className="position-title">{personalInfo.positionTitle}</h6>
                <h6 className="tagline">{personalInfo.tagline}</h6>
                <p className="summary">
                  {personalInfo.summary}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="horizontal-divider"></div>

        <div className="resume-section">
          <div className="section-header">
            <h2 className="section-title">Experience</h2>
            {isEditing && (
              <div className="section-actions">
                <button className="add-item-btn" onClick={handleAddExperience}>
                  <i className="fas fa-plus"></i> Add Experience
                </button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            // Edit mode
            editedExperiences.map((exp, index) => (
              <div key={index} className="item-edit-container">
                {editingSection === 'experiences' && editingItemIndex === index ? (
                  // Form for editing
                  <div className="edit-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor={`company-${index}`}>Company</label>
                        <input
                          type="text"
                          id={`company-${index}`}
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`position-${index}`}>Position</label>
                        <input
                          type="text"
                          id={`position-${index}`}
                          value={exp.position}
                          onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor={`startDate-${index}`}>Start Date</label>
                        <input
                          type="date"
                          id={`startDate-${index}`}
                          value={exp.startDate ? exp.startDate.substring(0, 10) : ''}
                          onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`endDate-${index}`}>End Date</label>
                        <div className="end-date-container">
                          {exp.endDate === 'present' ? (
                            <>
                              <div className="present-checkbox">
                                <input
                                  type="checkbox"
                                  id={`present-${index}`}
                                  checked={true}
                                  onChange={(e) => {
                                    if (!e.target.checked) {
                                      handleExperienceChange(index, 'endDate', new Date().toISOString().substring(0, 10));
                                    }
                                  }}
                                />
                                <label htmlFor={`present-${index}`}>Present</label>
                              </div>
                            </>
                          ) : (
                            <>
                              <input
                                type="date"
                                id={`endDate-${index}`}
                                value={exp.endDate ? exp.endDate.substring(0, 10) : ''}
                                onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                              />
                              <div className="present-checkbox">
                                <input
                                  type="checkbox"
                                  id={`present-${index}`}
                                  checked={false}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      handleExperienceChange(index, 'endDate', 'present');
                                    }
                                  }}
                                />
                                <label htmlFor={`present-${index}`}>Present</label>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor={`location-${index}`}>Location</label>
                        <input
                          type="text"
                          id={`location-${index}`}
                          value={exp.location}
                          onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`workType-${index}`}>Work Type</label>
                        <select
                          id={`workType-${index}`}
                          value={exp.workType}
                          onChange={(e) => handleExperienceChange(index, 'workType', e.target.value)}
                        >
                          <option value="On-site">On-site</option>
                          <option value="Remote">Remote</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`technologies-${index}`}>Technologies</label>
                      <input
                        type="text"
                        id={`technologies-${index}`}
                        value={exp.technologies}
                        onChange={(e) => handleExperienceChange(index, 'technologies', e.target.value)}
                      />
                    </div>
                    
                    <div className="item-actions">
                      <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                      <button className="save-btn" onClick={() => setEditingItemIndex(null)}>Done</button>
                    </div>
                  </div>
                ) : (
                  // Display form with edit/delete options
                  <>
                    <div className="item-edit-header">
                      <div className="item-edit-title">{exp.company || 'New Experience'}</div>
                      <div className="item-edit-actions">
                        <i className="fas fa-edit edit-action-icon" onClick={() => handleEditExperience(index)}></i>
                        <i className="fas fa-trash-alt edit-action-icon" onClick={() => handleDeleteExperience(index)}></i>
                      </div>
                    </div>
                    <div>
                      <p className="position-title">{exp.position}</p>
                      <p className="date-range">
                        {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Start Date'} - {
                          exp.endDate === 'present' ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'End Date')
                        }
                      </p>
                      <p className="location">{exp.location || 'Location'} · {exp.workType}</p>
                      <p className="technologies">Technologies: {exp.technologies || 'Not specified'}</p>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            // View mode
            experiences && experiences.length > 0 && experiences.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="experience-header">
                  <span className="company-name">{exp.company}</span>
                  <div className="date-range">
                    {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Start Date'} - {
                      exp.endDate === 'present' ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    } · {calculateDuration(exp.startDate, exp.endDate)}
                  </div>
                </div>
                <div className="position-title">{exp.position}</div>
                <div className="location">{exp.location} · {exp.workType}</div>
                <p className="technologies">Technologies: {exp.technologies}</p>
              </div>
            ))
          )}
        </div>
        
        <div className="horizontal-divider"></div>

        <div className="resume-section">
          <div className="section-header">
            <h2 className="section-title">Projects</h2>
            {isEditing && (
              <div className="section-actions">
                <button className="add-item-btn" onClick={handleAddProject}>
                  <i className="fas fa-plus"></i> Add Project
                </button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            // Edit mode for projects
            editedProjects.map((project, index) => (
              <div key={index} className="item-edit-container">
                {editingSection === 'projects' && editingItemIndex === index ? (
                  // Form for editing project
                  <div className="edit-form">
                    <div className="form-group">
                      <label htmlFor={`project-name-${index}`}>Project Name</label>
                      <input
                        type="text"
                        id={`project-name-${index}`}
                        value={project.name}
                        onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor={`project-startDate-${index}`}>Start Date</label>
                        <input
                          type="date"
                          id={`project-startDate-${index}`}
                          value={project.startDate ? project.startDate.substring(0, 10) : ''}
                          onChange={(e) => handleProjectChange(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`project-endDate-${index}`}>End Date</label>
                        <div className="end-date-container">
                          {project.endDate === 'present' ? (
                            <div className="present-checkbox">
                              <input
                                type="checkbox"
                                id={`project-present-${index}`}
                                checked={true}
                                onChange={(e) => {
                                  if (!e.target.checked) {
                                    handleProjectChange(index, 'endDate', new Date().toISOString().substring(0, 10));
                                  }
                                }}
                              />
                              <label htmlFor={`project-present-${index}`}>Present</label>
                            </div>
                          ) : (
                            <>
                              <input
                                type="date"
                                id={`project-endDate-${index}`}
                                value={project.endDate ? project.endDate.substring(0, 10) : ''}
                                onChange={(e) => handleProjectChange(index, 'endDate', e.target.value)}
                              />
                              <div className="present-checkbox">
                                <input
                                  type="checkbox"
                                  id={`project-present-${index}`}
                                  checked={false}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      handleProjectChange(index, 'endDate', 'present');
                                    }
                                  }}
                                />
                                <label htmlFor={`project-present-${index}`}>Present</label>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`project-technologies-${index}`}>Technologies</label>
                      <input
                        type="text"
                        id={`project-technologies-${index}`}
                        value={project.technologies}
                        onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                      />
                    </div>
                    
                    <div className="item-actions">
                      <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                      <button className="save-btn" onClick={() => setEditingItemIndex(null)}>Done</button>
                    </div>
                  </div>
                ) : (
                  // Display with edit/delete options
                  <>
                    <div className="item-edit-header">
                      <div className="item-edit-title">{project.name || 'New Project'}</div>
                      <div className="item-edit-actions">
                        <i className="fas fa-edit edit-action-icon" onClick={() => handleEditProject(index)}></i>
                        <i className="fas fa-trash-alt edit-action-icon" onClick={() => handleDeleteProject(index)}></i>
                      </div>
                    </div>
                    <div>
                      <div className="date-range">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Start Date'} - {
                          project.endDate === 'present' ? 'Present' : (project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'End Date')
                        }
                      </div>
                      <p className="technologies">{project.technologies || 'Technologies not specified'}</p>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            // View mode for projects
            projects && projects.length > 0 && projects.map((project, index) => (
              <div key={index} className="project-item">
                <div className="project-header">
                  <h3 className="project-name">{project.name}</h3>
                  <div className="project-duration">
                    {project.startDate && project.endDate && (
                      <>
                        {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {
                          project.endDate === 'present' ? 'Present' : new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        } · {calculateDuration(project.startDate, project.endDate)}
                      </>
                    )}
                  </div>
                </div>
                <p className="technologies">{project.technologies}</p>
              </div>
            ))
          )}
        </div>
    
        <div className="horizontal-divider"></div>

        <div className="resume-section">
          <div className="section-header">
            <h2 className="section-title">Education</h2>
            {isEditing && (
              <div className="section-actions">
                <button className="add-item-btn" onClick={handleAddEducation}>
                  <i className="fas fa-plus"></i> Add Education
                </button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            // Edit mode for education
            editedEducation.map((edu, index) => (
              <div key={index} className="item-edit-container">
                {editingSection === 'education' && editingItemIndex === index ? (
                  // Form for editing education
                  <div className="edit-form">
                    <div className="form-group">
                      <label htmlFor={`degree-${index}`}>Degree</label>
                      <input
                        type="text"
                        id={`degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`school-${index}`}>School</label>
                      <input
                        type="text"
                        id={`school-${index}`}
                        value={edu.school}
                        onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor={`edu-startDate-${index}`}>Start Date</label>
                        <input
                          type="date"
                          id={`edu-startDate-${index}`}
                          value={edu.startDate ? edu.startDate.substring(0, 10) : ''}
                          onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`edu-endDate-${index}`}>End Date</label>
                        <input
                          type="date"
                          id={`edu-endDate-${index}`}
                          value={edu.endDate ? edu.endDate.substring(0, 10) : ''}
                          onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor={`grade-${index}`}>Grade</label>
                        <input
                          type="text"
                          id={`grade-${index}`}
                          value={edu.grade || ''}
                          onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`edu-location-${index}`}>Location</label>
                        <input
                          type="text"
                          id={`edu-location-${index}`}
                          value={edu.location || ''}
                          onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="item-actions">
                      <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                      <button className="save-btn" onClick={() => setEditingItemIndex(null)}>Done</button>
                    </div>
                  </div>
                ) : (
                  // Display with edit/delete options
                  <>
                    <div className="item-edit-header">
                      <div className="item-edit-title">{edu.degree || 'New Education'}</div>
                      <div className="item-edit-actions">
                        <i className="fas fa-edit edit-action-icon" onClick={() => handleEditEducation(index)}></i>
                        <i className="fas fa-trash-alt edit-action-icon" onClick={() => handleDeleteEducation(index)}></i>
                      </div>
                    </div>
                    <div>
                      <div className="school">{edu.school || 'School/University'}</div>
                      <div className="education-details">
                        <div className="date-range">
                          {edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric' }) : 'Start Year'} - {
                            edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric' }) : 'End Year'
                          }
                        </div>
                        {edu.grade && <div className="grade">{edu.grade}</div>}
                        {edu.location && <div className="location">{edu.location}</div>}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            // View mode for education
            education && education.length > 0 && education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="degree">{edu.degree}</div>
                <div className="school">{edu.school}</div>
                <div className="education-details">
                  <div className="date-range">
                    {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric' })} - {
                      new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric' })
                    }
                  </div>
                  {edu.grade && <div className="grade">{edu.grade}</div>}
                  {edu.location && <div className="location">{edu.location}</div>}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="horizontal-divider"></div>

        <div className="skills-section">
          <div className="section-header">
            <h2 className="section-title">Skills</h2>
            {isEditing && (
              <div className="section-actions">
                <button className="add-item-btn" onClick={handleAddSkillCategory}>
                  <i className="fas fa-plus"></i> Add Skill Category
                </button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            // Edit mode for skills
            Object.entries(editedSkills).map(([category, skills]) => (
              <div key={category} className="item-edit-container">
                {editingSection === 'skills' && editingItemIndex === category ? (
                  // Form for editing skills
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Category Name</label>
                      <input
                        type="text"
                        value={category}
                        readOnly
                      />
                    </div>
                    
                    {skills.map((skill, index) => (
                      <div key={index} className="skill-row">
                        <div className="form-group">
                          <label htmlFor={`skill-name-${category}-${index}`}>Skill Name</label>
                          <input
                            type="text"
                            id={`skill-name-${category}-${index}`}
                            value={skill.name}
                            onChange={(e) => handleSkillChange(category, index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`skill-level-${category}-${index}`}>
                            Skill Level ({skill.level}%)
                          </label>
                          <input
                            type="range"
                            id={`skill-level-${category}-${index}`}
                            min="0"
                            max="100"
                            value={skill.level}
                            onChange={(e) => handleSkillChange(category, index, 'level', e.target.value)}
                          />
                        </div>
                        <button
                          className="remove-skill-btn"
                          onClick={() => handleDeleteSkill(category, index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                    
                    <button
                      className="add-skill-btn"
                      onClick={() => handleAddSkill(category)}
                    >
                      <i className="fas fa-plus"></i> Add Skill
                    </button>
                    
                    <div className="item-actions">
                      <button className="delete-btn" onClick={() => handleDeleteSkillCategory(category)}>Delete Category</button>
                      <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                      <button className="save-btn" onClick={() => setEditingItemIndex(null)}>Done</button>
                    </div>
                  </div>
                ) : (
                  // Display with edit option
                  <>
                    <div className="item-edit-header">
                      <div className="item-edit-title">{category}</div>
                      <div className="item-edit-actions">
                        <i className="fas fa-edit edit-action-icon" onClick={() => handleEditSkills(category)}></i>
                        <i className="fas fa-trash-alt edit-action-icon" onClick={() => handleDeleteSkillCategory(category)}></i>
                      </div>
                    </div>
                    <div className="skills-grid">
                      {skills.map((skill, index) => (
                        <div key={index}>
                          <div>{skill.name}</div>
                          <div className="skill-bar">
                            <div
                              className="skill-level"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            // View mode for skills
            skills && Object.keys(skills).length > 0 && Object.entries(skills).map(([category, items]) => (
              <div key={category} className="skill-category">
                <h3 className="skill-title">{category}</h3>
                <div className="skills-grid">
                  {items.map((skill) => (
                    <div key={skill.name}>
                      <div>{skill.name}</div>
                      <div className="skill-bar">
                        <div
                          className="skill-level"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Resume; 