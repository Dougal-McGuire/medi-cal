/**
 * Utility functions for generating printable calculator results
 */

/**
 * Generate a printable HTML document for calculator results
 * @param {Object} config - Configuration object
 * @param {string} config.calculatorName - Name of the calculator
 * @param {Object} config.result - Calculator result object
 * @param {Object} config.inputs - Input values used for calculation
 * @param {string|null} config.patientId - Optional patient identifier
 * @param {Object} config.additionalInfo - Additional information to display
 * @returns {string} HTML string for printing
 */
export function generatePrintableHTML({
  calculatorName,
  result,
  inputs,
  patientId = null,
  additionalInfo = {}
}) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const printStyles = `
    <style>
      @media print {
        @page {
          margin: 2cm;
          size: A4;
        }
      }
      
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      
      .print-header {
        text-align: center;
        border-bottom: 2px solid #0066cc;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      
      .print-header h1 {
        color: #0066cc;
        margin: 0;
        font-size: 28px;
      }
      
      .print-header .subtitle {
        color: #666;
        margin: 5px 0;
        font-size: 16px;
      }
      
      .patient-info {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 20px;
      }
      
      .patient-info h3 {
        margin: 0 0 10px 0;
        color: #0066cc;
      }
      
      .result-section {
        margin-bottom: 30px;
      }
      
      .result-value {
        font-size: 36px;
        font-weight: bold;
        color: #0066cc;
        margin: 10px 0;
      }
      
      .result-category {
        font-size: 24px;
        font-weight: 500;
        margin: 10px 0;
      }
      
      .category-normal { color: #28a745; }
      .category-underweight { color: #17a2b8; }
      .category-overweight { color: #ffc107; }
      .category-obese { color: #dc3545; }
      
      .input-section,
      .formula-section,
      .interpretation-section {
        margin-bottom: 20px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      
      .section-title {
        font-weight: bold;
        color: #0066cc;
        margin-bottom: 10px;
        font-size: 18px;
      }
      
      .input-item,
      .range-item {
        margin: 5px 0;
        display: flex;
        justify-content: space-between;
      }
      
      .formula-description {
        font-style: italic;
        color: #666;
        margin-top: 5px;
      }
      
      .disclaimer {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        padding: 15px;
        border-radius: 5px;
        margin-top: 30px;
        font-size: 14px;
      }
      
      .disclaimer strong {
        color: #856404;
      }
      
      .print-footer {
        text-align: center;
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        color: #666;
        font-size: 14px;
      }
      
      .ranges-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-top: 10px;
      }
      
      @media (max-width: 600px) {
        .ranges-grid {
          grid-template-columns: 1fr;
        }
        
        .input-item,
        .range-item {
          flex-direction: column;
        }
      }
    </style>
  `;

  const patientSection = patientId ? `
    <div class="patient-info">
      <h3>Patient Information</h3>
      <div><strong>Patient ID:</strong> ${escapeHtml(patientId)}</div>
      <div><strong>Report Date:</strong> ${currentDate}</div>
    </div>
  ` : `
    <div class="patient-info">
      <h3>Report Information</h3>
      <div><strong>Generated:</strong> ${currentDate}</div>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${calculatorName} Report${patientId ? ' - ' + escapeHtml(patientId) : ''}</title>
      ${printStyles}
    </head>
    <body>
      <div class="print-header">
        <h1>MediCal ${calculatorName}</h1>
        <div class="subtitle">Medical Calculator Report</div>
      </div>
      
      ${patientSection}
      
      ${generateResultSection(result, calculatorName)}
      
      ${generateInputSection(inputs)}
      
      ${generateFormulaSection(result.formula)}
      
      ${generateInterpretationSection(result.interpretation)}
      
      ${generateAdditionalInfoSection(additionalInfo)}
      
      <div class="disclaimer">
        <strong>Medical Disclaimer:</strong> This calculator is for educational and informational purposes only. 
        The results should not be used as a substitute for professional medical advice, diagnosis, or treatment. 
        Always consult with qualified healthcare providers for medical decisions and personalized health assessments.
      </div>
      
      <div class="print-footer">
        <div>Generated by MediCal - Medical Calculator Tools</div>
        <div>Report generated on ${currentDate}</div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate the result section HTML
 */
function generateResultSection(result, calculatorName) {
  const categoryClass = `category-${result.category.toLowerCase().replace(/\s+/g, '-')}`;
  
  let resultLabel = 'Result';
  let resultValue = result.bmi;
  let resultUnit = '';
  
  // Handle different result types
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
  
  return `
    <div class="result-section">
      <div class="section-title">${calculatorName} Results</div>
      <div class="result-value">${resultLabel}: ${resultValue}${resultUnit}</div>
      <div class="result-category ${categoryClass}">Category: ${result.category}</div>
    </div>
  `;
}

/**
 * Generate the input section HTML
 */
function generateInputSection(inputs) {
  const inputItems = Object.entries(inputs)
    .map(([key, value]) => {
      const label = formatInputLabel(key);
      const formattedValue = formatInputValue(key, value);
      return `<div class="input-item"><span>${label}:</span><span>${formattedValue}</span></div>`;
    })
    .join('');

  return `
    <div class="input-section">
      <div class="section-title">Input Values</div>
      ${inputItems}
    </div>
  `;
}

/**
 * Generate the formula section HTML
 */
function generateFormulaSection(formula) {
  if (!formula) return '';
  
  return `
    <div class="formula-section">
      <div class="section-title">Formula Information</div>
      <div><strong>Formula:</strong> ${formula.name}</div>
      <div class="formula-description">${formula.description}</div>
    </div>
  `;
}

/**
 * Generate the interpretation section HTML
 */
function generateInterpretationSection(interpretation) {
  if (!interpretation || !interpretation.ranges) return '';
  
  const rangeItems = Object.entries(interpretation.ranges)
    .map(([category, range]) => {
      const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
      return `<div class="range-item"><span>${categoryLabel}:</span><span>${range}</span></div>`;
    })
    .join('');

  return `
    <div class="interpretation-section">
      <div class="section-title">Category Ranges</div>
      <div class="ranges-grid">
        ${rangeItems}
      </div>
    </div>
  `;
}

/**
 * Generate additional information section HTML
 */
function generateAdditionalInfoSection(additionalInfo) {
  if (!additionalInfo || Object.keys(additionalInfo).length === 0) return '';
  
  const infoItems = Object.entries(additionalInfo)
    .map(([key, value]) => {
      const label = formatInputLabel(key);
      return `<div class="input-item"><span>${label}:</span><span>${value}</span></div>`;
    })
    .join('');

  return `
    <div class="input-section">
      <div class="section-title">Additional Information</div>
      ${infoItems}
    </div>
  `;
}

/**
 * Format input labels for display
 */
function formatInputLabel(key) {
  const labelMap = {
    weight: 'Weight',
    height: 'Height',
    heightMeters: 'Height (meters)',
    formula: 'Formula Used',
    unit: 'Unit System'
  };
  
  return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

/**
 * Format input values for display
 */
function formatInputValue(key, value) {
  const unitMap = {
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
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Open the print dialog with the generated HTML
 * @param {string} htmlContent - HTML content to print
 */
export function openPrintDialog(htmlContent) {
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