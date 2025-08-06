import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './Help.css';

const Help = () => {
  const { isDarkMode } = useTheme();

  const helpSections = [
    {
      title: 'Getting Started',
      icon: '🚀',
      items: [
        'Upload your PDF or Word document using the "Upload Document" button',
        'Select your preferred analysis options',
        'Wait for the AI to process your document',
        'View and download your comprehensive analysis report'
      ]
    },
    {
      title: 'Supported File Types',
      icon: '📄',
      items: [
        'PDF files (.pdf)',
        'Microsoft Word documents (.docx, .doc)',
        'Text files (.txt)',
        'Maximum file size: 10MB'
      ]
    },
    {
      title: 'Analysis Features',
      icon: '🔍',
      items: [
        'Grammar and style correction',
        'Content summarization',
        'Inconsistency detection',
        'Document structure analysis',
        'Key insights extraction'
      ]
    },
    {
      title: 'Troubleshooting',
      icon: '🔧',
      items: [
        'Ensure your file is not password-protected',
        'Check that your file size is under 10MB',
        'Make sure your document contains readable text',
        'Try refreshing the page if upload fails'
      ]
    }
  ];

  const contactInfo = {
    email: 'support@aidocumentanalyzer.com',
    phone: '+1 (555) 123-4567',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM EST',
    responseTime: 'We typically respond within 24 hours'
  };

  return (
    <div className="help-page">
      <div className="help-header">
        <h1>Help & Support</h1>
        <p>Find answers to common questions and get in touch with our support team</p>
      </div>

      <div className="help-content">
        <div className="help-sections">
          {helpSections.map((section, index) => (
            <div key={index} className="help-section" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="section-header">
                <span className="section-icon">{section.icon}</span>
                <h2>{section.title}</h2>
              </div>
              <ul className="section-list">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="contact-section">
          <div className="contact-card">
            <div className="contact-header">
              <span className="contact-icon">📞</span>
              <h2>Contact Support</h2>
            </div>
            <p>Need help? Our support team is here to assist you!</p>
            
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">📧 Email:</span>
                <a href={`mailto:${contactInfo.email}`} className="contact-value">
                  {contactInfo.email}
                </a>
              </div>
              
              <div className="contact-item">
                <span className="contact-label">📱 Phone:</span>
                <a href={`tel:${contactInfo.phone}`} className="contact-value">
                  {contactInfo.phone}
                </a>
              </div>
              
              <div className="contact-item">
                <span className="contact-label">🕒 Hours:</span>
                <span className="contact-value">{contactInfo.hours}</span>
              </div>
              
              <div className="contact-item">
                <span className="contact-label">⏱️ Response Time:</span>
                <span className="contact-value">{contactInfo.responseTime}</span>
              </div>
            </div>

            <div className="contact-actions">
              <button 
                className="contact-button email"
                onClick={() => window.open(`mailto:${contactInfo.email}?subject=AI Document Analyzer Support Request`, '_blank')}
              >
                📧 Send Email
              </button>
              <button 
                className="contact-button phone"
                onClick={() => window.open(`tel:${contactInfo.phone}`, '_blank')}
              >
                📞 Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help; 