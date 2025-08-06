import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './Dashboard.css';

const Dashboard = ({ onAnalyze, userStats, onStatsUpdate, onPageChange }) => {
  const { isDarkMode } = useTheme();

  const stats = [
    { 
      title: 'Documents Analyzed', 
      value: userStats?.documents_analyzed?.toString() || '0', 
      icon: '📄', 
      color: '#4CAF50' 
    },
    { 
      title: 'Reports Generated', 
      value: userStats?.reports_generated?.toString() || '0', 
      icon: '📊', 
      color: '#2196F3' 
    },
    { 
      title: 'Accuracy Rate', 
      value: '96%', 
      icon: '🎯', 
      color: '#FF9800' 
    },
    { 
      title: 'Last Analysis', 
      value: userStats?.last_analysis ? 
        new Date(userStats.last_analysis).toLocaleDateString() : 
        'Never', 
      icon: '⏰', 
      color: '#9C27B0' 
    },
  ];

  const features = [
    {
      title: 'Document Analysis',
      description: 'Upload PDFs and Word documents for comprehensive AI analysis',
      icon: '🔍',
      color: '#4CAF50',
    },
    {
      title: 'Grammar Correction',
      description: 'Get instant grammar and style suggestions for your content',
      icon: '✏️',
      color: '#2196F3',
    },
    {
      title: 'Smart Summaries',
      description: 'Generate concise summaries of lengthy documents',
      icon: '📝',
      color: '#FF9800',
    },
    {
      title: 'Inconsistency Detection',
      description: 'Identify and flag inconsistencies across your documents',
      icon: '⚠️',
      color: '#F44336',
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back! 👋</h1>
          <p>Ready to analyze your next document?</p>
        </div>
        <button className="analyze-button" onClick={onAnalyze}>
          <span className="button-icon">🚀</span>
          Start Analysis
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ '--accent-color': stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="features-section">
        <h2>What can AI Analyzer do for you?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ '--accent-color': feature.color, animationDelay: `${0.6 + index * 0.1}s` }}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="actions-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-button" onClick={onAnalyze}>
            <span className="action-icon">📄</span>
            <span className="action-text">Upload Document</span>
          </button>
          <button className="action-button" onClick={() => onPageChange('history')}>
            <span className="action-icon">📚</span>
            <span className="action-text">View History</span>
          </button>
          <button className="action-button" onClick={() => onPageChange('settings')}>
            <span className="action-icon">⚙️</span>
            <span className="action-text">Settings</span>
          </button>
          <button className="action-button" onClick={() => onPageChange('help')}>
            <span className="action-icon">❓</span>
            <span className="action-text">Help</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 