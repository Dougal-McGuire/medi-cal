/**
 * Utility functions for generating printable calculator results
 */

import { STRINGS } from '@/resources/strings';

interface PrintConfig {
  calculatorName: string;
  result: any;
  inputs: Record<string, any>;
  patientId?: string | null;
  additionalInfo?: Record<string, any>;
}

/**
 * Generate a printable HTML document for calculator results
 */
export function generatePrintableHTML({
  calculatorName,
  result,
  inputs,
  patientId = null,
  additionalInfo = {}
}: PrintConfig): string {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const tailwindCDN = `<script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              'custom-blue': '#0066cc',
              'custom-gray': '#666',
              'custom-light-gray': '#f8f9fa',
              'custom-border': '#ddd'
            }
          }
        }
      }
    </script>
  `;

  const patientSection = patientId ? `
    <div class="bg-custom-light-gray p-3 rounded-md mb-4 text-sm print:mb-3">
      <h3 class="m-0 mb-2 text-custom-blue text-base font-semibold">Patient Information</h3>
      <div><strong>Patient ID:</strong> ${escapeHtml(patientId)}</div>
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${calculatorName} Report${patientId ? ' - ' + escapeHtml(patientId) : ''}</title>
      ${tailwindCDN}
    </head>
    <body class="font-sans leading-normal text-gray-800 max-w-4xl mx-auto p-3 text-sm print:text-xs print:p-6 print:max-w-none">
      <div class="text-center border-b-2 border-custom-blue pb-3 mb-4 print:pb-2 print:mb-3">
        <h1 class="text-custom-blue m-0 text-2xl font-bold print:text-xl">MediCal ${calculatorName}</h1>
        <div class="text-custom-gray my-1 text-sm">Calculator Report</div>
      </div>
      
      ${patientSection}
      
      ${generateResultSection(result, calculatorName)}
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 print:gap-3 print:mb-3">
        <div>
          ${generateInputSection(inputs)}
          ${generateAdditionalInfoSection(additionalInfo)}
        </div>
        <div>
          ${generateFormulaSection(result.formula)}
          ${generateInterpretationSection(result.interpretation)}
        </div>
      </div>
      
      <div class="text-center mt-5 pt-4 border-t border-custom-border text-custom-gray text-xs print:mt-4 print:pt-3">
        <div>Report generated on ${currentDate}</div>
        <div>${STRINGS.FOOTER_COPYRIGHT}</div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate the result section HTML
 */
function generateResultSection(result: any, calculatorName: string): string {
  let categoryClass = '';
  let resultLabel = 'Result';
  let resultValue = '';
  let resultUnit = '';
  let categoryDisplay = '';
  
  // Handle BMI Calculator results
  if (result.bmi && result.category) {
    const categoryColors: Record<string, string> = {
      'normal weight': 'text-green-600',
      'underweight': 'text-cyan-600', 
      'overweight': 'text-yellow-600',
      'obese': 'text-red-600'
    };
    categoryClass = categoryColors[result.category.toLowerCase()] || 'text-gray-800';
    resultValue = result.bmi;
    categoryDisplay = `<div class="text-lg font-medium my-2 ${categoryClass} print:text-base">Category: ${result.category}</div>`;
    
    if (result.formula && result.formula.name) {
      if (result.formula.name.includes('BMI Prime')) {
        resultLabel = 'BMI Prime';
      } else if (result.formula.name.includes('Reciprocal') || result.formula.name.includes('Ponderal')) {
        resultLabel = 'Ponderal Index';
      } else {
        resultLabel = 'BMI';
        resultUnit = ' kg/m²';
      }
    }
  }
  // Handle BSA Calculator results
  else if (result.bsa) {
    resultLabel = 'BSA';
    resultValue = result.bsa;
    resultUnit = ' m²';
    categoryDisplay = '<div class="text-base text-gray-600 my-2 print:text-sm">Body Surface Area calculated</div>';
  }
  // Handle Creatinine Calculator results
  else if (result.egfr && result.interpretation && result.interpretation.ckdStage) {
    resultLabel = result.units === 'mL/min' ? 'CrCl' : 'eGFR';
    resultValue = result.egfr;
    resultUnit = ` ${result.units}`;
    const stage = result.interpretation.ckdStage;
    const stageColors: Record<number, string> = {
      1: 'text-green-600', 2: 'text-green-600', 3: 'text-yellow-600', 
      4: 'text-orange-500', 5: 'text-red-600'
    };
    const stageClass = stageColors[stage.stage] || 'text-gray-800';
    categoryDisplay = `<div class="text-lg font-medium my-2 ${stageClass} print:text-base">${stage.description}</div>`;
  }
  
  return `
    <div class="mb-4 text-center print:mb-3">
      <div class="font-bold text-custom-blue mb-2 text-sm print:text-xs">${calculatorName} Results</div>
      <div class="text-3xl font-bold text-custom-blue my-2 print:text-2xl">${resultLabel}: ${resultValue}${resultUnit}</div>
      ${categoryDisplay}
    </div>
  `;
}

/**
 * Generate the input section HTML
 */
function generateInputSection(inputs: Record<string, any>): string {
  const inputItems = Object.entries(inputs)
    .map(([key, value]) => {
      const label = formatInputLabel(key);
      const formattedValue = formatInputValue(key, value);
      return `<div class="my-1 flex justify-between text-xs print:text-xs"><span>${label}:</span><span>${formattedValue}</span></div>`;
    })
    .join('');

  return `
    <div class="p-3 border border-custom-border rounded-md text-sm mb-4 print:p-2 print:mb-3">
      <div class="font-bold text-custom-blue mb-2 text-sm print:text-xs">Input Values</div>
      ${inputItems}
    </div>
  `;
}

/**
 * Generate the formula section HTML
 */
function generateFormulaSection(formula: any): string {
  if (!formula) return '';
  
  return `
    <div class="p-3 border border-custom-border rounded-md text-sm mb-4 print:p-2 print:mb-3">
      <div class="font-bold text-custom-blue mb-2 text-sm print:text-xs">Formula Information</div>
      <div><strong>Formula:</strong> ${formula.name}</div>
      <div class="italic text-custom-gray mt-1 text-xs">${formula.description}</div>
    </div>
  `;
}

/**
 * Generate the interpretation section HTML
 */
function generateInterpretationSection(interpretation: any): string {
  if (!interpretation || !interpretation.ranges) return '';
  
  const rangeItems = Object.entries(interpretation.ranges)
    .map(([category, range]) => {
      const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
      return `<div class="my-1 flex justify-between text-xs"><span>${categoryLabel}:</span><span>${range}</span></div>`;
    })
    .join('');

  return `
    <div class="p-3 border border-custom-border rounded-md text-sm mb-4 print:p-2 print:mb-3">
      <div class="font-bold text-custom-blue mb-2 text-sm print:text-xs">Category Ranges</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
        ${rangeItems}
      </div>
    </div>
  `;
}

/**
 * Generate additional information section HTML
 */
function generateAdditionalInfoSection(additionalInfo: Record<string, any>): string {
  if (!additionalInfo || Object.keys(additionalInfo).length === 0) return '';
  
  const infoItems = Object.entries(additionalInfo)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      const label = formatInputLabel(key);
      return `<div class="my-1 flex justify-between text-xs"><span>${label}:</span><span>${value}</span></div>`;
    })
    .join('');

  if (!infoItems) return '';

  return `
    <div class="p-3 border border-custom-border rounded-md text-sm mb-4 print:p-2 print:mb-3">
      <div class="font-bold text-custom-blue mb-2 text-sm print:text-xs">Additional Information</div>
      ${infoItems}
    </div>
  `;
}

/**
 * Format input labels for display
 */
function formatInputLabel(key: string): string {
  const labelMap: Record<string, string> = {
    weight: 'Weight',
    height: 'Height',
    heightMeters: 'Height (meters)',
    formula: 'Formula Used',
    unit: 'Unit System',
    calculationDate: 'Calculation Date',
    formulaUsed: 'Formula Used'
  };
  
  return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
}

/**
 * Format input values for display
 */
function formatInputValue(key: string, value: any): string {
  const unitMap: Record<string, string> = {
    weight: ' kg',
    height: ' cm',
    heightMeters: ' m'
  };
  
  if (typeof value === 'number') {
    return value + (unitMap[key] || '');
  }
  
  return String(value);
}

/**
 * Escape HTML characters to prevent XSS
 */
function escapeHtml(text: string): string {
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Fallback for server-side rendering
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Open the print dialog with the generated HTML
 */
export function openPrintDialog(htmlContent: string): void {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow popups to enable printing functionality.');
    return;
  }
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    
    // Close the window after printing (optional)
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };
}