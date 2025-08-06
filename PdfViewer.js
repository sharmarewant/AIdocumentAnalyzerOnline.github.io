import React from 'react';
import './PdfViewer.css';

const PdfViewer = ({ fileUrl, onClose, authToken }) => {
  if (!fileUrl) {
    return null;
  }

  // Construct the full URL with token for viewing
  const authenticatedUrl = `${fileUrl}?token=${authToken}`;

  return (
    <div className="pdf-viewer-overlay" onClick={onClose}>
      <div className="pdf-viewer-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <iframe
          src={authenticatedUrl}
          title="PDF Viewer"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
};

export default PdfViewer; 