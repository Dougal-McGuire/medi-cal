# Print Functionality Documentation

## Overview

The print functionality is a reusable component system that allows all calculators to generate professional, printable reports of calculation results. This includes patient identification and comprehensive formatting suitable for medical documentation.

## Components

### 1. PrintButton Component
**Location:** `commons/components/PrintButton.js`

A reusable button component that triggers the print workflow.

#### Props
- `calculatorName` (string, required): Display name of the calculator
- `result` (object, required): Calculator result object
- `inputs` (object, required): Input values used for calculation
- `additionalInfo` (object, optional): Additional information to include
- `variant` (string, optional): Button style ('primary', 'secondary', 'outline')
- `disabled` (boolean, optional): Whether button is disabled
- `className` (string, optional): Additional CSS classes

#### Usage Example
```jsx
import PrintButton from '../../commons/components/PrintButton';

<PrintButton
  calculatorName="BMI Calculator"
  result={bmiResult}
  inputs={{
    weight: 70,
    height: 175,
    heightMeters: 1.75
  }}
  additionalInfo={{
    calculationDate: new Date().toLocaleDateString(),
    formulaUsed: "Traditional BMI"
  }}
  variant="outline"
/>
```

### 2. PrintModal Component
**Location:** `commons/components/PrintModal.js`

Modal dialog for collecting optional patient identifier.

#### Features
- Optional patient ID input field
- Form validation and submission
- Keyboard navigation support
- Mobile-responsive design
- Accessible modal implementation

### 3. Print Utilities
**Location:** `commons/utils/printUtils.js`

Core utilities for generating printable HTML documents.

#### Main Functions

##### generatePrintableHTML(config)
Generates a complete HTML document optimized for printing.

**Parameters:**
- `config.calculatorName` (string): Calculator display name
- `config.result` (object): Calculator result object
- `config.inputs` (object): Input values used
- `config.patientId` (string|null): Optional patient identifier
- `config.additionalInfo` (object): Additional information

**Returns:** Complete HTML string ready for printing

##### openPrintDialog(htmlContent)
Opens the browser print dialog with the generated content.

**Parameters:**
- `htmlContent` (string): HTML content to print

## Print Report Structure

### 1. Header Section
- MediCal branding
- Calculator name
- Report generation timestamp

### 2. Patient Information (if provided)
- Patient identifier
- Report generation date

### 3. Results Section
- Primary calculation result with units
- Category classification with color coding
- Large, prominent display formatting

### 4. Input Values Section
- All input parameters used
- Formatted with appropriate units
- Clear label-value pairs

### 5. Formula Information Section
- Formula name and description
- Mathematical representation
- Context about formula characteristics

### 6. Interpretation Section
- Category ranges specific to the formula used
- Color-coded reference ranges
- Grid layout for easy reading

### 7. Additional Information Section (if provided)
- Custom additional data
- Calculation metadata
- Context-specific information

### 8. Medical Disclaimer
- Standard medical disclaimer text
- Educational purpose statement
- Healthcare provider consultation recommendation

### 9. Footer
- MediCal attribution
- Report generation timestamp
- Professional formatting

## Styling and Formatting

### Print-Specific Styles
- A4 page formatting with 2cm margins
- Professional typography (Arial font family)
- High contrast colors for clear printing
- Proper page breaks and spacing
- Print-optimized layout adjustments

### Responsive Design
- Mobile-friendly modal interface
- Adaptive grid layouts
- Flexible content sections
- Touch-friendly interactive elements

### Color Coding
- **Normal weight:** Green (#28a745)
- **Underweight:** Light blue (#17a2b8)
- **Overweight:** Yellow (#ffc107)
- **Obese:** Red (#dc3545)

## Integration Guide

### 1. Import Components
```jsx
import PrintButton from '../../commons/components/PrintButton';
```

### 2. Add Print Button
Place the PrintButton component in your calculator results section:

```jsx
{result && (
  <div className="result-card">
    {/* Result display */}
    
    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
      <PrintButton
        calculatorName="Your Calculator Name"
        result={result}
        inputs={inputValues}
        additionalInfo={extraInfo}
        variant="outline"
      />
    </div>
  </div>
)}
```

### 3. Ensure CSS is Available
The modal styles are included in the main `globals.css` file. No additional imports required.

## Browser Compatibility

### Supported Browsers
- Chrome 60+ (recommended)
- Firefox 55+
- Safari 12+
- Edge 79+

### Print Features
- PDF generation support
- Custom page formatting
- Print preview functionality
- Popup window management

## Accessibility Features

### Modal Accessibility
- Focus management and keyboard navigation
- Screen reader compatibility
- ARIA labels and roles
- High contrast support

### Print Report Accessibility
- Semantic HTML structure
- Proper heading hierarchy
- Clear visual hierarchy
- High contrast text and backgrounds

## Security Considerations

### Input Sanitization
- All user inputs are HTML-escaped
- XSS prevention in patient ID field
- Safe HTML generation practices

### Privacy
- Patient IDs are processed locally only
- No data transmission to external services
- Print content generated client-side

## Customization Options

### Styling Customization
- CSS variables for color schemes
- Responsive breakpoints
- Print-specific media queries
- Custom button variants

### Content Customization
- Additional information sections
- Custom disclaimers
- Branding modifications
- Layout adjustments

## Testing Guidelines

### Manual Testing Checklist
- [ ] Print button appears when results are available
- [ ] Print button is disabled when no results
- [ ] Modal opens correctly
- [ ] Patient ID input works (optional field)
- [ ] Print dialog opens successfully
- [ ] Generated report contains all sections
- [ ] Print formatting is correct
- [ ] Colors appear correctly in print preview
- [ ] Mobile responsive behavior works

### Cross-Browser Testing
- Test in major browsers (Chrome, Firefox, Safari, Edge)
- Verify print dialog functionality
- Check popup blocker compatibility
- Validate PDF generation

### Device Testing
- Desktop print functionality
- Mobile print behavior
- Tablet interface testing
- Touch interaction validation

## Implementation Notes

### File Organization
```
commons/
├── components/
│   ├── PrintButton.js
│   └── PrintModal.js
├── utils/
│   └── printUtils.js
└── styles/
    └── modal.css (integrated into globals.css)
```

### Dependencies
- React 18+ (useState hook)
- Next.js (for component structure)
- CSS custom properties support
- Modern browser with print API

### Performance Considerations
- HTML generation is client-side only
- Minimal additional bundle size
- Lazy loading of print functionality
- Efficient DOM manipulation

This print functionality provides a professional, accessible, and user-friendly way to generate medical calculator reports suitable for clinical documentation and patient records.