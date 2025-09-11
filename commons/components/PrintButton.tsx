import { useState } from 'react';
import PrintModal from './PrintModal';
import { generatePrintableHTML, openPrintDialog } from '../utils/printUtils';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  calculatorName: string;
  result: any;
  inputs: Record<string, any>;
  additionalInfo?: Record<string, any>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  className?: string;
}

/**
 * Reusable Print Button Component
 */
export default function PrintButton({
  calculatorName,
  result,
  inputs,
  additionalInfo = {},
  variant = 'outline',
  disabled = false,
  className = ''
}: PrintButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handlePrintClick = () => {
    if (!result) {
      alert('Please calculate results before printing.');
      return;
    }
    setShowModal(true);
  };

  const handlePrint = (patientId: string) => {
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
        className={className}
        title={!result ? 'Calculate results first' : 'Print results'}
      >
        <Printer className="mr-2 h-4 w-4" />
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