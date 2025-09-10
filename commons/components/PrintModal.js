import { useState } from 'react';

export default function PrintModal({ isOpen, onClose, onPrint, calculatorName }) {
  const [patientId, setPatientId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPrint(patientId.trim() || null);
    setPatientId('');
    onClose();
  };

  const handleCancel = () => {
    setPatientId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Print {calculatorName} Results</h3>
          <button 
            className="modal-close"
            onClick={handleCancel}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="patient-id">
                Patient Identifier (Optional)
              </label>
              <input
                type="text"
                id="patient-id"
                placeholder="Enter patient ID, name, or reference"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                maxLength={100}
              />
              <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                This identifier will be included in the printed report for reference purposes.
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Print Results
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}