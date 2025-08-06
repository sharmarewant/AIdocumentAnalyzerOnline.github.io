import React, { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import PdfViewer from './components/PdfViewer';
import FormatSelectionModal from './components/FormatSelectionModal';
import ReportPage from './components/ReportPage';
import AnimatedBackground from './components/AnimatedBackground';
import Settings from './components/Settings';
import Help from './components/Help';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [currentReportId, setCurrentReportId] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setAuthToken(token);
        setUser(user);
        setIsAuthenticated(true);
        fetchUserStats(token);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const fetchUserStats = async (token) => {
    try {
      const response = await fetch(`${API_URL}/user/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleLogin = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    setAuthToken(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    fetchUserStats(token);
  };

  const handleSignup = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    setAuthToken(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    fetchUserStats(token);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAuthToken(null);
    setUserStats(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const handleSwitchToSignup = () => {
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
  };

  const handleDownloadRequest = (reportId) => {
    setSelectedReportId(reportId);
    setShowFormatModal(true);
  };

  const handleFormatSelect = async (format) => {
    if (!selectedReportId) return;

    try {
      const response = await fetch(`${API_URL}/report/${selectedReportId}?format=${format}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to download report');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI_Document_Analysis_${selectedReportId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setShowFormatModal(false);
      setSelectedReportId(null);
    }
  };

  const handleDeleteAnalysis = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/analysis/${reportId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete analysis');
      }

      // Refresh user stats to update the history list
      fetchUserStats(authToken);
      
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete analysis. Please try again.');
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    // Update the user state and local storage
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const handleNavigateToReport = (reportId) => {
    setCurrentReportId(reportId);
    setCurrentPage('report');
  };

  const handleShowPdf = (reportId) => {
    // This function can now be simplified or removed if not used elsewhere
    setPdfUrl(`${API_URL}/report/${reportId}?format=pdf`);
    setShowPdfViewer(true);
  };

  const handleClosePdf = () => {
    setShowPdfViewer(false);
    setPdfUrl('');
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        {showSignup ? (
          <Signup onSignup={handleSignup} onSwitchToLogin={handleSwitchToLogin} />
        ) : (
          <Login onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />
        )}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="App">
        <AnimatedBackground />
        <Navbar 
          user={user} 
          onLogout={handleLogout}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentReportId(null); // Reset reportId when changing main pages
            setCurrentPage(page);
          }}
        />
        <main className="main-content">
          {currentPage === 'dashboard' && (
            <Dashboard 
              onAnalyze={() => setCurrentPage('analyzer')} 
              userStats={userStats}
              onStatsUpdate={() => fetchUserStats(authToken)}
              onPageChange={setCurrentPage}
            />
          )}
          {currentPage === 'analyzer' && (
            <FileUpload 
              API_URL={API_URL} 
              authToken={authToken}
              onAnalysisComplete={(reportId) => {
                fetchUserStats(authToken);
                handleNavigateToReport(reportId);
              }}
            />
          )}
          {currentPage === 'history' && (
            <div className="history-page">
              <h2>Analysis History</h2>
              {userStats?.analysis_history?.length > 0 ? (
                <div className="history-list">
                  {userStats.analysis_history.map((item, index) => (
                    <div 
                      key={index} 
                      className="history-item"
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => handleNavigateToReport(item.id)}
                    >
                      <div className="history-info">
                        <h3>{item.document_name}</h3>
                        {/* Truncate summary for display */}
                        <p>{item.summary.substring(0, 100)}...</p>
                        <small>{new Date(item.timestamp).toLocaleString()}</small>
                      </div>
                      <div className="history-item-buttons">
                        <button 
                          className="history-button download"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadRequest(item.id);
                          }}
                        >
                          📥 Download
                        </button>
                        <button 
                          className="history-button delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAnalysis(item.id);
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No analysis history yet. Start by analyzing your first document!</p>
              )}
            </div>
          )}
          {currentPage === 'report' && currentReportId && (
            <ReportPage
              reportId={currentReportId}
              API_URL={API_URL}
              authToken={authToken}
              onBack={() => setCurrentPage('history')}
            />
          )}
          {currentPage === 'settings' && (
            <Settings user={user} onProfileUpdate={handleProfileUpdate} />
          )}
          {currentPage === 'help' && (
            <Help />
          )}
        </main>
        {showPdfViewer && (
          <PdfViewer 
            fileUrl={pdfUrl} 
            onClose={handleClosePdf} 
            authToken={authToken} 
          />
        )}
        {showFormatModal && (
          <FormatSelectionModal 
            onSelect={handleFormatSelect}
            onClose={() => setShowFormatModal(false)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;