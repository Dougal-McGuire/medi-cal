# BMI Calculator Specification

## Overview

The Body Mass Index (BMI) calculator is a medical tool used to assess whether an individual's weight falls within a healthy range relative to their height. This specification defines the enhanced BMI calculator with multiple formula options and metric-only units.

## Current Implementation Analysis

**Current Features:**
- Supports both metric and imperial units
- Uses traditional Quetelet BMI formula
- Provides BMI value and weight category classification
- Basic input validation

**Current Limitations:**
- Only one BMI formula (traditional)
- Imperial units add complexity without significant value for medical use
- Height input in meters can be unintuitive (most people think in centimeters)
- Limited medical context for BMI interpretation

## Enhanced Requirements

### Input Requirements

**Weight:**
- Input: Numeric value in kilograms (kg)
- Range: 1.0 - 1000.0 kg
- Precision: One decimal place
- Validation: Must be positive number

**Height:**
- Input: Numeric value in centimeters (cm) 
- Range: 50 - 300 cm
- Precision: One decimal place  
- Validation: Must be positive number
- Conversion: Automatically converted to meters for calculations

**BMI Formula Selection:**
- Input: Dropdown selection
- Default: Traditional Quetelet Index
- Options: 5 different BMI formulas (see Formula Specifications)

### Output Requirements

**BMI Value:**
- Precision: One decimal place
- Units: kg/m²
- Display: Numerical value with units

**Weight Category:**
- Classification based on WHO standards
- Categories: Underweight, Normal weight, Overweight, Obese
- Color coding for visual emphasis

**Formula Information:**
- Display selected formula name
- Brief description of formula characteristics
- Year/source of formula

**Input Echo:**
- Display entered weight and height values
- Show converted values where applicable

## Formula Specifications

### 1. Traditional Quetelet Index (Default)
**Formula:** `BMI = weight(kg) / height(m)²`
**Description:** Original BMI formula developed by Adolphe Quetelet (1830-1850)
**Use Case:** Standard medical reference, widely accepted
**Characteristics:** Simple calculation, potential bias for very tall/short individuals

### 2. Trefethen's New BMI
**Formula:** `New BMI = 1.3 × weight(kg) / height(m)^2.5`
**Description:** Modified formula by Nick Trefethen (2013) to reduce height bias
**Use Case:** Better accuracy for individuals of non-average height
**Characteristics:** Addresses distortions in traditional BMI for tall/short people

### 3. BMI Prime
**Formula:** `BMI Prime = Traditional BMI / 25`
**Description:** Ratio-based BMI where 1.0 represents the upper limit of normal weight
**Use Case:** Simplified interpretation with dimensionless result
**Characteristics:** Values <0.74 (underweight), 0.74-1.0 (normal), >1.0 (overweight), >1.2 (obese)

### 4. Reciprocal BMI (Ponderal Index)
**Formula:** `Ponderal Index = weight(kg) / height(m)³`
**Description:** Alternative index, also known as the Ponderal Index, that scales cubically with height.
**Use Case:** Research applications, may provide a better correlation with body fat percentage.
**Characteristics:** In this implementation, higher values indicate higher body mass relative to height. The categories are inverted compared to traditional BMI.

### 5. Geometric Mean BMI
**Formula:** `Geometric BMI = weight(kg) / (height(m) × sqrt(height(m)))`
**Description:** Uses geometric mean of height scaling factors
**Use Case:** Compromise between traditional BMI and cube-root scaling
**Characteristics:** Intermediate approach between BMI and ponderal index

## Weight Categories

### Traditional BMI Categories (WHO Standards)
- **Underweight:** BMI < 18.5
- **Normal weight:** 18.5 ≤ BMI < 25.0
- **Overweight:** 25.0 ≤ BMI < 30.0
- **Obese:** BMI ≥ 30.0

### BMI Prime Categories
- **Underweight:** BMI Prime < 0.74
- **Normal weight:** 0.74 ≤ BMI Prime < 1.0
- **Overweight:** 1.0 ≤ BMI Prime < 1.2
- **Obese:** BMI Prime ≥ 1.2

### Reciprocal BMI Categories (Inverted)
- **Underweight:** Reciprocal BMI > 14.0
- **Normal weight:** 10.0 < Reciprocal BMI ≤ 14.0
- **Overweight:** 7.5 < Reciprocal BMI ≤ 10.0
- **Obese:** Reciprocal BMI ≤ 7.5

## API Specification

### Endpoint
`POST /api/calculators/bmi`

### Request Body
```json
{
  "weight": 70.5,
  "height": 175.0,
  "formula": "traditional"
}
```

### Request Parameters
- `weight` (required): Number, weight in kg (1.0-1000.0)
- `height` (required): Number, height in cm (50-300)
- `formula` (optional): String, formula selection
  - `"traditional"` (default) - Quetelet Index
  - `"trefethen"` - Trefethen's New BMI
  - `"prime"` - BMI Prime
  - `"reciprocal"` - Reciprocal BMI
  - `"geometric"` - Geometric Mean BMI

### Response Body (Success)
```json
{
  "bmi": 23.0,
  "category": "Normal weight",
  "formula": {
    "name": "Traditional Quetelet Index",
    "key": "traditional",
    "description": "Standard BMI calculation"
  },
  "input": {
    "weight": 70.5,
    "height": 175.0,
    "heightMeters": 1.75
  },
  "interpretation": {
    "ranges": {
      "underweight": "< 18.5",
      "normal": "18.5 - 24.9",
      "overweight": "25.0 - 29.9", 
      "obese": "≥ 30.0"
    }
  }
}
```

### Error Responses
```json
{
  "error": "Invalid input parameters",
  "details": {
    "weight": "Must be between 1.0 and 1000.0 kg",
    "height": "Must be between 50 and 300 cm"
  }
}
```

## Frontend Specification

### Form Layout
1. **Weight Input**
   - Label: "Weight (kg)"
   - Input type: number
   - Step: 0.1
   - Placeholder: "70.0"

2. **Height Input**
   - Label: "Height (cm)"
   - Input type: number
   - Step: 0.1
   - Placeholder: "175.0"

3. **Formula Selection**
   - Label: "BMI Formula"
   - Input type: select dropdown
   - Default: Traditional Quetelet Index
   - Options with descriptions

4. **Calculate Button**
   - Text: "Calculate BMI"
   - Disabled during calculation
   - Loading state indicator

### Result Display
1. **BMI Value**
   - Large, prominent display
   - Color coded by category
   - Units displayed (kg/m²)

2. **Category**
   - Clear text description
   - Color coded background/text
   - Category ranges shown

3. **Formula Information**
   - Formula name and description
   - Mathematical formula display
   - Input values confirmation

4. **Additional Context**
   - BMI interpretation guidelines
   - Links to relevant medical resources
   - Disclaimer about medical consultation

## Validation Rules

### Input Validation
- Weight: 1.0 ≤ weight ≤ 1000.0 kg
- Height: 50 ≤ height ≤ 300 cm
- Formula: Must be one of the supported formula keys
- All inputs must be numeric

### Calculation Validation
- Handle division by zero scenarios
- Validate result ranges are reasonable
- Ensure formula-specific calculations are correct

### Output Validation
- BMI results should be reasonable (1.0 - 200.0 range)
- Category assignments should match BMI values
- All required fields present in response

## Accessibility Requirements

- Form labels properly associated with inputs
- Color coding supplemented with text/icons
- Keyboard navigation support
- Screen reader compatibility
- Clear error messaging
- Responsive design for mobile devices

## Medical Disclaimers

- BMI is a screening tool, not a diagnostic tool
- Individual body composition varies
- Consultation with healthcare providers recommended
- Not suitable for certain populations (athletes, elderly, etc.)
- Educational purposes only

## Implementation Notes

- Remove imperial unit support entirely
- Convert height from cm to meters internally
- Implement formula selection with clear descriptions
- Add comprehensive input validation
- Provide educational content about BMI limitations
- Ensure medical disclaimer is prominent