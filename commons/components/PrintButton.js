import { useState } from 'react';
import PrintModal from './PrintModal';
import { generatePrintableHTML, openPrintDialog } from '../utils/printUtils';
import { Button } from '../../components/ui/button';
import { Printer } from 'lucide-react';

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

  return (
    <>
      <Button
        variant={variant}
        onClick={handlePrintClick}
        disabled={disabled || !result}
        title={!result ? 'Calculate results first' : 'Print results'}
        className={className}
      >
        <Printer className="h-4 w-4 mr-2" />
        Print Results
      </Button>

      <PrintModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onPrint={handlePrint}
        calculatorName={calculatorName}
      />
    </>
  );
}

