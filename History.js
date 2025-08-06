import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './History.css';
import { FaFilePdf, FaFileWord, FaTrash } from 'react-icons/fa';

const History = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const { setIsLoading, setHeader, setBackgroundImage } = useContext(AppContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    setHeader('Analysis History');
    setBackgroundImage(null); 
    
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/user/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch history');
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchHistory();
    } else {
      navigate('/login');
    }
  }, [token, navigate, setIsLoading, setHeader, setBackgroundImage]);

  const handleItemClick = (reportId) => {
    navigate(`/report/${reportId}`);
  };

  const handleDelete = async (e, reportId) => {
    e.stopPropagation(); // Prevent navigation when clicking the delete button
    
    if (!window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/analysis/${reportId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete analysis.');
      }

      // Update state to remove the deleted item
      setHistory(prevHistory => prevHistory.filter(item => item.id !== reportId));

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="history-container">
      {history.length === 0 ? (
        <p>No analysis history found.</p>
      ) : (
        <ul className="history-list">
          {history.map(item => (
            <li key={item.id} className="history-item" onClick={() => handleItemClick(item.id)}>
              <div className="history-item-icon">
                {item.file_type === 'pdf' ? <FaFilePdf /> : <FaFileWord />}
              </div>
              <div className="history-item-details">
                <span className="history-item-name">{item.original_filename}</span>
                <span className="history-item-date">
                  Analyzed on: {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
              <button className="delete-history-btn" onClick={(e) => handleDelete(e, item.id)}>
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History; 