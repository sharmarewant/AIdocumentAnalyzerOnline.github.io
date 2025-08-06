import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = ({ user, onLogout, currentPage, onPageChange }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analyzer', label: 'Analyzer', icon: '🔍' },
    { id: 'history', label: 'History', icon: '📚' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="navbar-logo">
            <span className="logo-icon">🤖</span>
            AI Analyzer
          </h1>
        </div>

        <div className="navbar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onPageChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="navbar-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          <div className="user-menu">
            <button
              className="user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-avatar-large">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="user-details">
                    <div className="user-name-large">{user?.name || 'User'}</div>
                    <div className="user-email">{user?.email || 'user@example.com'}</div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => onPageChange('help')}>
                  <span className="dropdown-icon">❓</span>
                  Help & Support
                </button>
                <button className="dropdown-item" onClick={onLogout}>
                  <span className="dropdown-icon">🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 