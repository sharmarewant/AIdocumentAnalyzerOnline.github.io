import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import FormatSelectionModal from './FormatSelectionModal';
import './ReportPage.css';

const ReportPage = ({ reportId, API_URL, authToken, onBack }) => {
  const { isDarkMode } = useTheme();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFormatModal, setShowFormatModal] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`${API_URL}/analysis/${reportId}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (!response.ok) throw new Error('Failed to fetch analysis details.');
        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [reportId, API_URL, authToken]);

  const handleDownloadRequest = () => {
    setShowFormatModal(true);
  };

  const handleFormatSelect = async (format) => {
    try {
      const response = await fetch(`${API_URL}/report/${reportId}?format=${format}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (!response.ok) throw new Error('Download failed.');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI_Analysis_${analysis?.document_name || reportId}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setShowFormatModal(false);
    }
  };

  if (loading) return <div className="report-loading">Loading report...</div>;
  if (error) return <div className="report-error">Error: {error}</div>;
  if (!analysis) return <div className="report-error">Report not found.</div>;

  return (
    <div className="report-page-container">
      <div className="report-header">
        <div>
          <button onClick={onBack} className="back-button">← Back to History</button>
          <h1>Analysis Report</h1>
          <p className="document-name">{analysis.document_name}</p>
          <span className="timestamp">Analyzed on: {new Date(analysis.timestamp).toLocaleString()}</span>
        </div>
        <button className="download-report-button" onClick={handleDownloadRequest}>
          📥 Download Report
        </button>
      </div>

      <div className="results-grid">
        <div className="result-card">
          <h3>📝 Summary</h3>
          <div className="content-scroll">
            {analysis.summary || 'Data not available for this analysis.'}
          </div>
        </div>
        <div className="result-card">
          <h3>✏️ Grammar Corrections</h3>
          <div className="content-scroll">
            {analysis.grammar_correction || 'Data not available for this analysis.'}
          </div>
        </div>
        <div className="result-card">
          <h3>💡 Improvement Suggestions</h3>
          <div className="content-scroll">
            {analysis.suggestions || 'Data not available for this analysis.'}
          </div>
        </div>
        <div className="result-card">
          <h3>⚠️ Screenshot Inconsistencies</h3>
          <div className="content-scroll">
            {analysis.inconsistencies || 'Data not available for this analysis.'}
          </div>
        </div>
        <div className="result-card">
          <h3>🔄 Repetitive Content</h3>
          <div className="content-scroll">
            {analysis.repetition_check || 'Data not available for this analysis.'}
          </div>
        </div>
        <div className="result-card">
          <h3>❓ Internal Inconsistencies</h3>
          <div className="content-scroll">
            {analysis.internal_inconsistencies || 'Data not available for this analysis.'}
          </div>
        </div>
      </div>

      {showFormatModal && (
        <FormatSelectionModal
          onSelect={handleFormatSelect}
          onClose={() => setShowFormatModal(false)}
        />
      )}
    </div>
  );
};

export default ReportPage; 