import React, { useState, useEffect } from 'react';
import './About.css';
import { useData } from '../context/dataContext';
import { useParams } from 'react-router-dom';
import { usePassword } from '../context/PasswordContext';
import PasswordValidation from '../components/PasswordValidation';
import { FaEdit } from 'react-icons/fa';

const About = () => {
  const { profileId } = useParams();
  const { getProfileByProfileId, updateData } = useData();
  const { isProfileValidated } = usePassword();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [editedPersonalInfo, setEditedPersonalInfo] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfileByProfileId(profileId);
        setProfile(profileData);
        setEditedPersonalInfo(profileData?.personalInfo || {});
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [profileId, getProfileByProfileId]);

  const handleEdit = (section) => {
    setEditingSection(section);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!isProfileValidated) {
      setPendingAction('save');
      setShowPasswordModal(true);
      return;
    }

    try {
      const updatedProfile = { ...profile, personalInfo: editedPersonalInfo };
      await updateData(profileId, updatedProfile);
      setProfile(updatedProfile);
      setStatusMessage('Changes saved successfully!');
      setIsEditing(false);
    } catch (error) {
      setStatusMessage('Error saving changes');
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setEditedPersonalInfo(profile?.personalInfo || {});
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (e, index, arrayName) => {
    const { value } = e.target;
    setEditedPersonalInfo(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const calculateExperience = (startDate) => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const today = new Date();
    let years = today.getFullYear() - start.getFullYear();
    let months = today.getMonth() - start.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years === 0) {
      return `${months} months`;
    } else if (years === 1) {
      return months === 0 
        ? '1 year' 
        : `1 year ${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      return months === 0 
        ? `${years} years` 
        : `${years} years ${months} ${months === 1 ? 'month' : 'months'}`;
    }
  };

  if (!profile || !profile.personalInfo) {
    return <div className="about-container">Loading...</div>;
  }

  const experience = calculateExperience(editedPersonalInfo.experienceStartDate);
  const professionalSummary = editedPersonalInfo.professionalSummary ? editedPersonalInfo.professionalSummary.replace('{experience}', experience) : '';

  return (
    <div className="about-container">
      <h1 className="about-title">ABOUT ME</h1>
      <p className="last-updated">(UPDATED {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()})</p>

      <section className="about-section">
        <h2 className="section-title">PROFESSIONAL SUMMARY
          {!isEditing && (
            <button 
              onClick={() => handleEdit('professionalSummary')}
              className="edit-button"
            >
              <FaEdit />
            </button>
          )}
        </h2>
        {isEditing && editingSection === 'professionalSummary' ? (
          <div className="edit-controls">
            <button onClick={handleSave} className="save-button">Save</button>
            <button onClick={handleCancel} className="cancel-button">Cancel</button>
          </div>
        ) : null}
        
        {isEditing && editingSection === 'professionalSummary' ? (
          <textarea
            name="professionalSummary"
            value={editedPersonalInfo.professionalSummary || ''}
            onChange={handleInputChange}
            className="edit-input"
          />
        ) : (
          <div className="content-with-edit">
            <p>
              {professionalSummary}
            </p>
          </div>
        )}
      </section>

      {editedPersonalInfo.personalBackground && (
        <section className="about-section">
          <h2 className="section-title">PERSONAL BACKGROUND
            {!isEditing && (
                <button 
                  onClick={() => handleEdit('personalBackground')}
                  className="edit-button"
                >
                  <FaEdit />
                </button>
              )}
          </h2>
          {isEditing && editingSection === 'personalBackground' ? (
            <div className="edit-controls">
              <button onClick={handleSave} className="save-button">Save</button>
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </div>
          ) : null}
          
          {isEditing && editingSection === 'personalBackground' ? (
            <textarea
              name="personalBackground"
              value={editedPersonalInfo.personalBackground || ''}
              onChange={handleInputChange}
              className="edit-input"
            />
          ) : (
            <div className="content-with-edit">
              <p>{editedPersonalInfo.personalBackground}</p>
            </div>
          )}
        </section>
      )}

      {editedPersonalInfo.history && editedPersonalInfo.history.length > 0 && (
        <section className="about-section">
          <h2 className="section-title">SOME HISTORY 
            {!isEditing && (
                <button 
                  onClick={() => handleEdit('history')}
                  className="edit-button"
                >
                  <FaEdit />
                </button>
              )}
          </h2>
          {isEditing && editingSection === 'history' ? (
            <div className="edit-controls">
              <button onClick={handleSave} className="save-button">Save</button>
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </div>
          ) : null}
          
          {isEditing && editingSection === 'history' ? (
            <div>
              {editedPersonalInfo.history.map((item, index) => (
                <div key={index} className="history-item">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayInputChange(e, index, 'history')}
                    className="edit-input"
                  />
                  <button onClick={() => {
                    setEditedPersonalInfo(prev => ({
                      ...prev,
                      history: prev.history.filter((_, i) => i !== index)
                    }))
                  }} className="remove-item-button">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              <button onClick={() => {
                setEditedPersonalInfo(prev => ({
                  ...prev,
                  history: [...prev.history, '']
                }))
              }} className="add-item-button">
                + Add History Item
              </button>
            </div>
          ) : (
            <div className="content-with-edit">
              <ul className="history-list">
                {editedPersonalInfo.history.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {editedPersonalInfo.technicalExpertise && Object.keys(editedPersonalInfo.technicalExpertise).length > 0 && (
        <section className="about-section">
          <h2 className="section-title">TECHNICAL EXPERTISE
            {!isEditing && (
                <button 
                  onClick={() => handleEdit('technicalExpertise')}
                  className="edit-button"
                >
                  <FaEdit />
                </button>
              )}
          </h2>
          {isEditing && editingSection === 'technicalExpertise' ? (
            <div className="edit-controls">
              <button onClick={handleSave} className="save-button">Save</button>
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </div>
          ) : null}
          
          {isEditing && editingSection === 'technicalExpertise' ? (
            <div>
              {Object.entries(editedPersonalInfo.technicalExpertise).map(([category, skills], index) => (
                <div key={index} className="expertise-item">
                  <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      setEditedPersonalInfo(prev => ({
                        ...prev,
                        technicalExpertise: {
                          ...prev.technicalExpertise,
                          [newCategory]: prev.technicalExpertise[category],
                          [category]: undefined
                        }
                      }))
                    }}
                    className="edit-input-category"
                  />
                  <input
                    type="text"
                    placeholder="Skills"
                    value={skills}
                    onChange={(e) => {
                      setEditedPersonalInfo(prev => ({
                        ...prev,
                        technicalExpertise: {
                          ...prev.technicalExpertise,
                          [category]: e.target.value
                        }
                      }))
                    }}
                    className="edit-input-skills"
                  />
                  <button onClick={() => {
                    const newExpertise = { ...editedPersonalInfo.technicalExpertise };
                    delete newExpertise[category];
                    setEditedPersonalInfo(prev => ({
                      ...prev,
                      technicalExpertise: newExpertise
                    }))
                  }} className="remove-item-button">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              <button onClick={() => {
                setEditedPersonalInfo(prev => ({
                  ...prev,
                  technicalExpertise: {
                    ...prev.technicalExpertise,
                    'New Category': ''
                  }
                }))
              }} className="add-item-button">+ Add Category</button>
            </div>
          ) : (
            <div>
              <ul className="expertise-list">
                {Object.entries(editedPersonalInfo.technicalExpertise).map(([category, skills]) => (
                  <li key={category}>
                    <strong>{category}:</strong> {skills}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {editedPersonalInfo.currentFocus && editedPersonalInfo.currentFocus.length > 0 && (
        <section className="about-section">
          <h2 className="section-title">CURRENT FOCUS
            {!isEditing && (
              <button 
                onClick={() => handleEdit('currentFocus')}
                className="edit-button"
              >
                <FaEdit />
              </button>
            )}
          </h2>
          {isEditing && editingSection === 'currentFocus' ? (
            <div className="edit-controls">
              <button onClick={handleSave} className="save-button">Save</button>
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </div>
          ) : null}
          
          {isEditing && editingSection === 'currentFocus' ? (
            <div>
              {editedPersonalInfo.currentFocus.map((item, index) => (
                <div key={index} className="focus-item">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayInputChange(e, index, 'currentFocus')}
                    className="edit-input"
                  />
                  <button onClick={() => {
                    setEditedPersonalInfo(prev => ({
                      ...prev,
                      currentFocus: prev.currentFocus.filter((_, i) => i !== index)
                    }))
                  }} className="remove-item-button">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              <button onClick={() => {
                setEditedPersonalInfo(prev => ({
                  ...prev,
                  currentFocus: [...prev.currentFocus, '']
                }))
              }}className="add-item-button"> + Add Focus Item</button>
            </div>
          ) : (
            <div>
              <ul className="focus-list">
                {editedPersonalInfo.currentFocus.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {editedPersonalInfo.dreams && editedPersonalInfo.dreams.length > 0 && (
        <section className="about-section">
          <h2 className="section-title">I DREAM OF
            {!isEditing && (
                <button 
                  onClick={() => handleEdit('dreams')}
                  className="edit-button"
                >
                  <FaEdit />
                </button>
              )}
          </h2>
          {isEditing && editingSection === 'dreams' ? (
            <div className="edit-controls">
              <button onClick={handleSave} className="save-button">Save</button>
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </div>
          ) : null}
          
          {isEditing && editingSection === 'dreams' ? (
            <div>
              {editedPersonalInfo.dreams.map((item, index) => (
                <div key={index} className="dreams-item">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayInputChange(e, index, 'dreams')}
                    className="edit-input"
                  />
                  <button onClick={() => {
                    setEditedPersonalInfo(prev => ({
                      ...prev,
                      dreams: prev.dreams.filter((_, i) => i !== index)
                    }))
                  }} className="remove-item-button">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              <button onClick={() => {
                setEditedPersonalInfo(prev => ({
                  ...prev,
                  dreams: [...prev.dreams, '']
                }))
              }} className="add-item-button">+ Add Dream Item</button>
            </div>
          ) : (
            <div>
              <ul className="dreams-list">
                {editedPersonalInfo.dreams.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {editedPersonalInfo.funFacts && editedPersonalInfo.funFacts.length > 0 && (
        <section className="about-section">
          <h2 className="section-title">FUN FACTS
            {!isEditing && (
                <button 
                  onClick={() => handleEdit('funFacts')}
                  className="edit-button"
                >
                  <FaEdit />
                </button>
              )}
          </h2>
          {isEditing && editingSection === 'funFacts' ? (
            <div className="edit-controls">
              <button onClick={handleSave} className="save-button">Save</button>
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </div>
          ) : null}
          
          {isEditing && editingSection === 'funFacts' ? (
            <div>
              {editedPersonalInfo.funFacts.map((item, index) => (
                <div key={index} className="fun-item">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayInputChange(e, index, 'funFacts')}
                    className="edit-input"
                  />
                  <button onClick={() => {
                    setEditedPersonalInfo(prev => ({
                      ...prev,
                      funFacts: prev.funFacts.filter((_, i) => i !== index)
                    }))
                  }} className="remove-item-button">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              <button onClick={() => {
                setEditedPersonalInfo(prev => ({
                  ...prev,
                  funFacts: [...prev.funFacts, '']
                }))
              }}className="add-item-button">+ Add Fun Fact Item</button>
            </div>
          ) : (
            <div>
              <ul className="fun-list">
                {editedPersonalInfo.funFacts.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {showPasswordModal && (
        <PasswordValidation
          onClose={() => {
            setShowPasswordModal(false);
            if (pendingAction === 'save' && isProfileValidated) {
              handleSave();
            }
          }}
        />
      )}

      {statusMessage && (
        <div className="status-message">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default About;