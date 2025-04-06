import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import './Resume.css';
import Avatar from '../components/Avatar';
import { useProfile } from '../context/ProfileContext';

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
  // Get the profile data from ProfileContext
  const { currentProfile } = useProfile();
  const { personalInfo, resume } = currentProfile;
  const { experiences, projects, education, skills, socialLinks } = resume;

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
      <button onClick={downloadPDF} className="download-button">
        Download Resume
      </button>
      <div ref={resumeRef} className="resume-container">
        <div className="resume-header">
          <div className="profile-section">
            <Avatar/>
            <div className="contact-info">
              <p><i className="fas fa-envelope"></i> {personalInfo.email}</p>
              <p><i className="fas fa-phone"></i> {personalInfo.phone}</p>
              <p><i className="fas fa-map-marker-alt"></i> {personalInfo.location}</p>
            </div>
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
          </div>
          
          <div className="main-content">
            <h1>{personalInfo.fullName}</h1>
            <div className="horizontal-divider"></div>
            <h6 className="position-title">{personalInfo.positionTitle}</h6>
            <h6 className="tagline">{personalInfo.tagline}</h6>
            <p className="summary">
              {personalInfo.summary}
            </p>
          </div>
        </div>

        <div className="horizontal-divider"></div>

        <div className="resume-section">
          <h2 className="section-title">Experience</h2>
          {experiences.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <span className="company-name">{exp.company}</span>
                <div className="date-range">
                  {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {
                    exp.endDate === 'present' ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  } · {calculateDuration(exp.startDate, exp.endDate)}
                </div>
              </div>
              <div className="position-title">{exp.position}</div>
              <div className="location">{exp.location} · {exp.workType}</div>
              <p className="technologies">Technologies: {exp.technologies}</p>
            </div>
          ))}
        </div>
        
        <div className="horizontal-divider"></div>

        <div className="resume-section">
          <h2 className="section-title">Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="project-item">
              <div className="project-header">
                <h3 className="project-name">{project.name}</h3>
                <div className="project-duration">
                  {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {
                    project.endDate === 'present' ? 'Present' : new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  } · {calculateDuration(project.startDate, project.endDate)}
                </div>
              </div>
              <p className="technologies">{project.technologies}</p>
            </div>
          ))}
        </div>

        <div className="horizontal-divider"></div>

        <div className="resume-section">
          <h2 className="section-title">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="degree">{edu.degree}</div>
              <div className="school">{edu.school}</div>
              <div className="education-details">
                <div className="date-range">
                  {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric' })} - {
                    new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric' })
                  }
                </div>
                <div className="grade">{edu.grade}</div>
                <div className="location">{edu.location}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="horizontal-divider"></div>

        <div className="skills-section">
          <h2 className="section-title">Skills</h2>
          {Object.entries(skills).map(([category, items]) => (
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
          ))}
        </div>
      </div>
    </>
  );
};

export default Resume; 