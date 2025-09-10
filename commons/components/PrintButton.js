import { useState } from 'react';
import PrintModal from './PrintModal';
import { generatePrintableHTML, openPrintDialog } from '../utils/printUtils';

/**
 * Reusable Print Button Component
 * 
 * @param {Object} props
 * @param {string} props.calculatorName - Name of the calculator (e.g., "BMI Calculator")
 * @param {Object} props.result - Calculator result object
 * @param {Object} props.inputs - Input values used for calculation
 * @param {Object} props.additionalInfo - Additional information to include in print
 * @param {string} props.variant - Button style variant ('primary', 'secondary', 'outline')
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {string} props.className - Additional CSS classes
 */
export default function PrintButton({
  calculatorName,
  result,
  inputs,
  additionalInfo = {},
  variant = 'outline',
  disabled = false,
  className = ''
}) {
  const [showModal, setShowModal] = useState(false);

  const handlePrintClick = () => {
    if (!result) {
      alert('Please calculate results before printing.');
      return;
    }
    setShowModal(true);
  };

  const handlePrint = (patientId) => {
    try {
      const printableHTML = generatePrintableHTML({
        calculatorName,
        result,
        inputs,
        patientId,
        additionalInfo
      });
      
      openPrintDialog(printableHTML);
    } catch (error) {
      console.error('Print generation failed:', error);
      alert('Failed to generate printable report. Please try again.');
    }
  };

  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    'print-button',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      <button
        type="button"
        className={buttonClasses}
        onClick={handlePrintClick}
        disabled={disabled || !result}
        title={!result ? 'Calculate results first' : 'Print results'}
      >
        <PrintIcon />
        <span>Print Results</span>
      </button>

      <PrintModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onPrint={handlePrint}
        calculatorName={calculatorName}
      />
    </>
  );
}

/**
 * Print Icon Component
 */
function PrintIcon() {
  return (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={{ marginRight: '0.5rem' }}
    >
      <polyline points="6,9 6,2 18,2 18,9"></polyline>
      <path d="M6,18L4,18a2,2 0 0,1 -2,-2L2,11a2,2 0 0,1 2,-2L20,9a2,2 0 0,1 2,2L22,16a2,2 0 0,1 -2,2L18,18"></path>
      <polyline points="6,14 18,14 18,22 6,22 6,14"></polyline>
    </svg>
  );
}