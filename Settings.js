import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ user, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    current_password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Password field should be empty for security
        current_password: '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If cancelling, reset form to original user data
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        current_password: '',
      });
    }
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Construct payload with only the changed fields
    const payload = {};
    if (formData.name !== user.name) {
      payload.name = formData.name;
    }
    if (formData.email !== user.email) {
      payload.email = formData.email;
    }
    if (formData.password) {
      payload.password = formData.password;
    }

    // If email or password is being changed, we must send the current password
    if (payload.email || payload.password) {
      if (!formData.current_password) {
        setError('Please enter your current password to make these changes.');
        return;
      }
      payload.current_password = formData.current_password;
    }

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return; // Nothing to update
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://127.0.0.1:8000/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to update profile.');
      }
      
      setSuccess('Profile updated successfully!');
      onProfileUpdate(data.user); // Callback to update user state in App.js
      setIsEditing(false);

    } catch (err) {
      setError(err.message);
    }
  };
  
  const llmModels = [
    {
      name: 'Google Gemini 1.5 Flash',
      description: 'Used for core text analysis tasks such as document summarization and grammar correction due to its speed and high accuracy for text-based content.',
      icon: '✨',
    },
    {
      name: 'Meta LLaMA 3',
      description: 'Leveraged for more complex reasoning tasks, including suggesting document improvements and identifying subtle inconsistencies between text and screenshots.',
      icon: '🦙',
    }
  ];

  return (
    <div className="settings-page">
      <div className="settings-section">
        <div className="profile-header">
          <h2>Profile Details</h2>
          <button onClick={handleEditToggle} className={`edit-profile-btn ${isEditing ? 'cancel' : ''}`}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <form onSubmit={handleSave} className="profile-details-form">
          <div className="detail-item">
            <label className="detail-label" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="detail-value"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="detail-item">
            <label className="detail-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="detail-value"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          {isEditing && (
            <>
              <div className="detail-item">
                <label className="detail-label" htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="detail-value"
                  placeholder="Leave blank to keep current password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="detail-item verification-password">
                <label className="detail-label" htmlFor="current_password">Current Password</label>
                <input
                  type="password"
                  id="current_password"
                  name="current_password"
                  className="detail-value"
                  placeholder="Required to change email or password"
                  value={formData.current_password}
                  onChange={handleInputChange}
                  required={formData.email !== user.email || !!formData.password}
                />
              </div>
            </>
          )}
          {isEditing && (
            <div className="form-actions">
              <button type="submit" className="save-btn">Save Changes</button>
            </div>
          )}
        </form>
      </div>

      <div className="settings-section">
        <h2>Language Model Configuration</h2>
        <p className="section-description">This application utilizes a combination of powerful AI models to deliver comprehensive analysis.</p>
        <div className="llm-cards-grid">
          {llmModels.map((model, index) => (
            <div key={index} className="llm-card">
              <div className="llm-card-header">
                <span className="llm-icon">{model.icon}</span>
                <h3>{model.name}</h3>
              </div>
              <p>{model.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings; 