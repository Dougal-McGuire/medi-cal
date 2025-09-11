# BSA Calculator Specification

## Overview

The Body Surface Area (BSA) calculator estimates the total surface area of a human body, which is crucial for medical calculations including drug dosing, chemotherapy protocols, cardiac index calculations, and physiological measurements. Direct measurement of BSA is impractical, so various mathematical formulas have been developed to estimate BSA based on height and weight.

## Medical Context

BSA is widely used in clinical practice because it provides a more accurate indicator of metabolic mass compared to body weight alone. It's essential for:

- **Drug Dosing**: Particularly for chemotherapy agents and certain antibiotics where precise dosing is critical
- **Cardiac Index**: Calculation of cardiac output relative to body size
- **Physiological Measurements**: Indexing various measurements like estimated glomerular filtration rate (eGFR)
- **Research Applications**: Standardizing measurements across different body sizes

## Input Requirements

### Weight
- Input: Numeric value in kilograms (kg)
- Range: 1.0 - 1000.0 kg
- Precision: One decimal place
- Validation: Must be positive number

### Height  
- Input: Numeric value in centimeters (cm)
- Range: 50 - 300 cm
- Precision: One decimal place
- Validation: Must be positive number
- Conversion: Automatically converted to meters for calculations

### Formula Selection
- Input: Dropdown selection
- Default: Du Bois Formula
- Options: 5 different BSA formulas (see Formula Specifications)

## Formula Specifications

### 1. Du Bois Formula (1916) - Default
**Formula:** `BSA = 0.007184 × height(cm)^0.725 × weight(kg)^0.425`
**Description:** Most widely used BSA formula, developed by Du Bois and Du Bois
**Use Case:** Standard medical reference, widely accepted across clinical practice
**Characteristics:** Well-validated, effective for both obese and non-obese patients
**Units:** Results in m²

### 2. Mosteller Formula (1987)
**Formula:** `BSA = √(height(cm) × weight(kg) / 3600)`
**Description:** Simplified formula that's easy to calculate mentally
**Use Case:** Quick bedside calculations, emergency situations
**Characteristics:** Simple square root calculation, comparable accuracy to Du Bois
**Units:** Results in m²

### 3. Haycock Formula (1978)
**Formula:** `BSA = 0.024265 × height(cm)^0.3964 × weight(kg)^0.5378`
**Description:** Formula developed specifically for pediatric populations
**Use Case:** Preferred for children and adolescents
**Characteristics:** Better accuracy for smaller body sizes, pediatric focus
**Units:** Results in m²

### 4. Boyd Formula (1935)
**Formula:** `BSA = 0.0003207 × height(cm)^0.3 × (weight(grams))^(0.7285 - 0.0188×log(weight(grams)))`
**Description:** Complex formula with logarithmic weight scaling
**Use Case:** Research applications, theoretical interest
**Characteristics:** Most complex calculation, accounts for non-linear weight scaling
**Units:** Results in m²

### 5. Gehan-George Formula (1970)
**Formula:** `BSA = 0.0235 × height(cm)^0.42246 × weight(kg)^0.51456`
**Description:** Alternative formula with different scaling exponents
**Use Case:** Research and validation studies
**Characteristics:** Moderate complexity, alternative to Du Bois for comparison
**Units:** Results in m²

## Output Requirements

### BSA Value
- Precision: Two decimal places
- Units: m² (square meters)
- Display: Numerical value with units
- Range: Typical values 0.5 - 3.0 m²

### Formula Information
- Display selected formula name and year
- Brief description of formula characteristics
- Mathematical formula display
- Appropriate use cases and context

### Input Confirmation
- Display entered weight and height values
- Show converted values where applicable
- Confirm formula selection

### Clinical Context
- Normal BSA ranges by age/gender
- Medical applications explanation
- Limitations and considerations

## API Specification

### Endpoint
`POST /api/calculators/bsa`

### Request Body
```json
{
  "weight": 70.0,
  "height": 175.0,
  "formula": "dubois"
}
```

### Request Parameters
- `weight` (required): Number, weight in kg (1.0-1000.0)
- `height` (required): Number, height in cm (50-300)
- `formula` (optional): String, formula selection
  - `"dubois"` (default) - Du Bois Formula
  - `"mosteller"` - Mosteller Formula
  - `"haycock"` - Haycock Formula
  - `"boyd"` - Boyd Formula
  - `"gehan"` - Gehan-George Formula

### Response Body (Success)
```json
{
  "bsa": 1.85,
  "formula": {
    "name": "Du Bois Formula (1916)",
    "key": "dubois",
    "description": "Most widely used BSA formula, standard medical reference"
  },
  "input": {
    "weight": 70.0,
    "height": 175.0,
    "heightMeters": 1.75
  },
  "interpretation": {
    "normalRanges": {
      "adult_male": "1.9 - 2.2 m²",
      "adult_female": "1.6 - 1.9 m²",
      "child": "Varies by age"
    },
    "applications": [
      "Drug dosing calculations",
      "Cardiac index determination",
      "Physiological measurement indexing"
    ]
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
   - Label: "BSA Formula"
   - Input type: select dropdown
   - Default: Du Bois Formula
   - Options with descriptions and years

4. **Calculate Button**
   - Text: "Calculate BSA"
   - Disabled during calculation
   - Loading state indicator

### Result Display
1. **BSA Value**
   - Large, prominent display
   - Units displayed (m²)
   - Appropriate precision (2 decimal places)

2. **Formula Information**
   - Formula name, year, and description
   - Mathematical formula display
   - Clinical context and applications

3. **Input Confirmation**
   - Weight and height values
   - Formula selection confirmation

4. **Clinical Context**
   - Normal BSA ranges
   - Medical applications
   - Links to relevant resources

## Validation Rules

### Input Validation
- Weight: 1.0 ≤ weight ≤ 1000.0 kg
- Height: 50 ≤ height ≤ 300 cm
- Formula: Must be one of the supported formula keys
- All inputs must be numeric

### Calculation Validation
- Handle edge cases and extreme values
- Validate result ranges are medically reasonable (0.1 - 5.0 m²)
- Ensure formula-specific calculations are mathematically correct

### Output Validation
- BSA results should be reasonable for given inputs
- All required fields present in response
- Proper decimal precision maintained

## Medical Considerations

### Clinical Applications
- **Chemotherapy Dosing**: Most chemotherapy regimens are dosed based on BSA
- **Cardiac Index**: Normal cardiac index is 2.5-4.0 L/min/m²
- **Renal Function**: eGFR is often expressed per 1.73 m² BSA
- **Burn Assessment**: Burn severity calculated as percentage of BSA affected

### Normal Ranges (Approximate)
- **Adult Males**: 1.9 - 2.2 m²
- **Adult Females**: 1.6 - 1.9 m²
- **Children**: Varies significantly by age (0.25 m² at birth to adult values)
- **Elderly**: May be lower due to height loss and weight changes

### Limitations
- Formula accuracy varies with extreme body sizes
- Not suitable for certain populations (amputees, severe edema)
- Different formulas can yield 10-15% variation in results
- Clinical context should always be considered

## Implementation Notes

- Follow existing BMI calculator architecture pattern
- Implement all 5 formulas with medical accuracy
- Include comprehensive validation and error handling
- Provide educational content about BSA clinical applications
- Ensure medical disclaimers are prominent
- Support print functionality for clinical documentation

## Medical Disclaimers

- BSA calculations are estimates based on mathematical models
- Different formulas may yield different results
- Clinical judgment should always be applied
- Consultation with healthcare providers recommended for medical decisions
- Not a substitute for direct medical measurement when available
- Educational and clinical support tool only