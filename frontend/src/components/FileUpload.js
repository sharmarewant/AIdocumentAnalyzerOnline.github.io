import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './FileUpload.css';
import FormatSelectionModal from './FormatSelectionModal';

const FileUpload = ({ API_URL, authToken, onAnalysisComplete }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [document, setDocument] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [chapter, setChapter] = useState('');
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [newReportId, setNewReportId] = useState(null);

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('word'))) {
      setDocument(file);
      setError('');
    } else {
      setError('Please select a valid PDF or Word document.');
    }
  };

  const handleScreenshotsChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setScreenshots(imageFiles);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!document) {
      setError('Please select a document to analyze.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setReportId(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('document', document);
      screenshots.forEach((file) => formData.append('screenshots', file));
      if (chapter) formData.append('chapter', chapter);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload files with authentication
      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData,
      });
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');

      setUploadProgress(95);

      // Trigger analysis with authentication
      const analyzeForm = new FormData();
      analyzeForm.append('token', uploadData.token);
      const analyzeRes = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: analyzeForm,
      });
      const analyzeData = await analyzeRes.json();
      
      if (!analyzeRes.ok) throw new Error(analyzeData.error || 'Analysis failed');

      setUploadProgress(100);
      setNewReportId(analyzeData.report_id);
      setAnalysisComplete(true);
      
      clearInterval(progressInterval);
      
      // No longer call onAnalysisComplete here, will be triggered by button click
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDownloadRequest = () => {
    if (!reportId) return;
    setShowFormatModal(true);
  };

  const handleFormatSelect = async (format) => {
    if (!reportId) return;
    
    try {
      const response = await fetch(`${API_URL}/report/${reportId}?format=${format}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download report');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI_Document_Analysis_${reportId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setShowFormatModal(false);
    }
  };

  const handleViewReport = () => {
    if (onAnalysisComplete && newReportId) {
      onAnalysisComplete(newReportId);
    }
  };

  const resetForm = () => {
    setDocument(null);
    setScreenshots([]);
    setChapter('');
    setResult(null);
    setReportId(null);
    setError('');
    setAnalysisComplete(false);
    setNewReportId(null);
  };

  return (
    <div className="file-upload-container">
      <div className="upload-header">
        <h1>Document Analysis</h1>
        <p>Upload your document and get AI-powered insights</p>
      </div>

      {analysisComplete ? (
        <div className="results-container-placeholder">
          <div className="results-header">
            <h2>Analysis Complete! 🎉</h2>
          </div>
          <p>Your document has been successfully analyzed.</p>
          <div className="actions-grid">
            <button className="action-button" onClick={handleViewReport}>
              <span className="action-icon">📄</span>
              View Full Report
            </button>
            <button className="action-button" onClick={resetForm}>
              <span className="action-icon">🔄</span>
              Analyze Another Document
            </button>
          </div>
        </div>
      ) : (
        <form className="upload-form" onSubmit={handleUpload}>
          <div className="upload-section">
            <div className="file-upload-area">
              <div className="upload-icon">📄</div>
              <h3>Upload Document</h3>
              <p>Supported formats: PDF, DOCX</p>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleDocumentChange}
                className="file-input"
                id="document-input"
              />
              <label htmlFor="document-input" className="file-label">
                Choose File
              </label>
              {document && (
                <div className="file-info">
                  <span className="file-name">{document.name}</span>
                  <span className="file-size">({(document.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}
            </div>

            <div className="file-upload-area">
              <div className="upload-icon">📸</div>
              <h3>Add Screenshots (Optional)</h3>
              <p>Upload images for additional context</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleScreenshotsChange}
                className="file-input"
                id="screenshots-input"
              />
              <label htmlFor="screenshots-input" className="file-label">
                Choose Images
              </label>
              {screenshots.length > 0 && (
                <div className="screenshots-preview">
                  {screenshots.map((file, index) => (
                    <div key={index} className="screenshot-item">
                      <span className="screenshot-name">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="chapter">Chapter/Section (Optional)</label>
            <input
              type="text"
              id="chapter"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="Enter chapter or section name"
              className="text-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className={`analyze-button ${loading ? 'loading' : ''}`}
            disabled={loading || !document}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing... {uploadProgress}%
              </>
            ) : (
              <>
                <span className="button-icon">🔍</span>
                Start Analysis
              </>
            )}
          </button>
        </form>
      )}
      {showFormatModal && (
        <FormatSelectionModal 
          onSelect={handleFormatSelect}
          onClose={() => setShowFormatModal(false)}
        />
      )}
    </div>
  );
};

export default FileUpload;
