import React from 'react';
import './FormatSelectionModal.css';

const FormatSelectionModal = ({ onSelect, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Select Download Format</h2>
        <p>Choose the format for your report.</p>
        <div className="format-buttons">
          <button 
            className="format-button docx"
            onClick={() => onSelect('docx')}
          >
            <span className="format-icon">📄</span>
            Word (.docx)
          </button>
          <button 
            className="format-button pdf"
            onClick={() => onSelect('pdf')}
          >
            <span className="format-icon">📑</span>
            PDF (.pdf)
          </button>
        </div>
        <button className="close-modal-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FormatSelectionModal; 