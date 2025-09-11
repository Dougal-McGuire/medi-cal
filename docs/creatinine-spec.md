# Creatinine Clearance Calculator Specification

## Overview

The Creatinine Clearance calculator estimates kidney function through glomerular filtration rate (eGFR) calculations using serum creatinine levels and patient characteristics. This tool is essential for assessing chronic kidney disease (CKD) staging, drug dosing adjustments, and monitoring renal function in clinical practice.

## Medical Context

Creatinine clearance and eGFR calculations are fundamental in nephrology and general medicine for:

- **CKD Staging**: Classification of chronic kidney disease severity (Stages 1-5)
- **Drug Dosing**: Adjustment of medications cleared by kidneys
- **Clinical Monitoring**: Tracking kidney function progression over time
- **Referral Decisions**: Determining need for nephrology consultation
- **Treatment Planning**: Planning interventions based on kidney function level

## Input Requirements

### Age
- Input: Numeric value in years
- Range: 18 - 120 years
- Validation: Must be positive integer
- Clinical Note: Pediatric formulas are different and not included

### Weight
- Input: Numeric value in kilograms (kg)
- Range: 30 - 300 kg
- Precision: One decimal place
- Validation: Must be positive number
- Clinical Note: Used primarily for Cockcroft-Gault formula

### Serum Creatinine
- Input: Numeric value in mg/dL
- Range: 0.1 - 20.0 mg/dL
- Precision: Two decimal places
- Validation: Must be positive number
- Clinical Note: Must be standardized IDMS-traceable value

### Sex
- Input: Radio button selection (Male/Female)
- Required: Yes
- Clinical Note: Affects muscle mass estimation in formulas

### Race (Optional)
- Input: Checkbox for Black/African American
- Optional: Yes (only for historical formulas)
- Clinical Note: CKD-EPI 2021 removed race coefficient

### Formula Selection
- Input: Dropdown selection
- Default: CKD-EPI 2021 (Recommended)
- Options: 4 different eGFR formulas (see Formula Specifications)

## Formula Specifications

### 1. CKD-EPI 2021 (Default - Recommended)
**Formula:** Complex piecewise function without race coefficient
**Description:** Latest recommended formula by NKF/ASN, removes race factor
**Use Case:** Current standard for eGFR estimation
**Characteristics:** Most accurate for diverse populations, no racial bias
**Units:** mL/min/1.73 m²

### 2. CKD-EPI 2009 (Historical)
**Formula:** Similar to 2021 but includes race coefficient (×1.159 if Black)
**Description:** Previous version of CKD-EPI with race adjustment
**Use Case:** Historical comparison, some guidelines still reference
**Characteristics:** Good accuracy but includes controversial race factor
**Units:** mL/min/1.73 m²

### 3. MDRD (Historical)
**Formula:** `175 × (Scr)^(-1.154) × (Age)^(-0.203) × (0.742 if female) × (1.212 if Black)`
**Description:** Modification of Diet in Renal Disease study equation
**Use Case:** Historical standard, still used in some contexts
**Characteristics:** Less accurate at higher GFR levels
**Units:** mL/min/1.73 m²

### 4. Cockcroft-Gault (Specific Use)
**Formula:** `((140 - Age) × Weight) / (72 × Scr) × (0.85 if female)`
**Description:** Estimates creatinine clearance, not GFR
**Use Case:** Drug dosing (DOACs, certain antibiotics)
**Characteristics:** Not normalized to BSA, may overestimate function
**Units:** mL/min

## CKD Staging Classification

### Stage 1: Normal or High (≥90 mL/min/1.73 m²)
- Kidney damage with normal GFR
- Usually requires evidence of kidney damage (proteinuria, etc.)

### Stage 2: Mildly Decreased (60-89 mL/min/1.73 m²)
- Kidney damage with mild decrease in GFR
- Monitor progression, address cardiovascular risk

### Stage 3a: Moderately Decreased (45-59 mL/min/1.73 m²)
- Moderate decrease in GFR
- Evaluate and treat complications

### Stage 3b: Moderately Decreased (30-44 mL/min/1.73 m²)
- Moderate decrease in GFR
- Prepare for renal replacement therapy

### Stage 4: Severely Decreased (15-29 mL/min/1.73 m²)
- Severe decrease in GFR
- Nephrology referral, prepare for dialysis/transplant

### Stage 5: Kidney Failure (<15 mL/min/1.73 m²)
- Kidney failure
- Dialysis or transplant if uremic

## API Specification

### Endpoint
`POST /api/calculators/creatinine`

### Request Body
```json
{
  "age": 65,
  "weight": 70.0,
  "creatinine": 1.2,
  "sex": "male",
  "race": "other",
  "formula": "ckd_epi_2021"
}
```

### Request Parameters
- `age` (required): Number, age in years (18-120)
- `weight` (required): Number, weight in kg (30-300)
- `creatinine` (required): Number, serum creatinine in mg/dL (0.1-20.0)
- `sex` (required): String, "male" or "female"
- `race` (optional): String, "black" or "other" (for historical formulas)
- `formula` (optional): String, formula selection
  - `"ckd_epi_2021"` (default) - CKD-EPI 2021
  - `"ckd_epi_2009"` - CKD-EPI 2009
  - `"mdrd"` - MDRD
  - `"cockcroft_gault"` - Cockcroft-Gault

### Response Body (Success)
```json
{
  "egfr": 58,
  "units": "mL/min/1.73 m²",
  "formula": {
    "name": "CKD-EPI 2021",
    "key": "ckd_epi_2021",
    "description": "Latest recommended formula without race factor"
  },
  "input": {
    "age": 65,
    "weight": 70.0,
    "creatinine": 1.2,
    "sex": "male",
    "race": "other"
  },
  "interpretation": {
    "ckdStage": {
      "stage": 3,
      "description": "Stage 3a: Moderately Decreased",
      "gfrRange": "45-59 mL/min/1.73 m²"
    },
    "clinicalContext": [
      "Moderate decrease in kidney function",
      "Evaluate and treat complications",
      "Consider nephrology referral",
      "Monitor progression annually"
    ]
  }
}
```

### Error Responses
```json
{
  "error": "Invalid input parameters",
  "details": {
    "age": "Must be between 18 and 120 years",
    "creatinine": "Must be between 0.1 and 20.0 mg/dL"
  }
}
```

## Frontend Specification

### Form Layout
1. **Age Input**
   - Label: "Age (years)"
   - Input type: number
   - Step: 1
   - Placeholder: "65"

2. **Weight Input**
   - Label: "Weight (kg)"
   - Input type: number
   - Step: 0.1
   - Placeholder: "70.0"

3. **Creatinine Input**
   - Label: "Serum Creatinine (mg/dL)"
   - Input type: number
   - Step: 0.01
   - Placeholder: "1.0"

4. **Sex Selection**
   - Label: "Sex"
   - Input type: radio buttons
   - Options: Male, Female

5. **Race Selection**
   - Label: "Race (for historical formulas)"
   - Input type: checkbox
   - Option: "Black/African American"
   - Helper text: "Not used in CKD-EPI 2021"

6. **Formula Selection**
   - Label: "eGFR Formula"
   - Input type: select dropdown
   - Default: CKD-EPI 2021
   - Options with descriptions and recommendations

7. **Calculate Button**
   - Text: "Calculate eGFR"
   - Disabled during calculation
   - Loading state indicator

### Result Display
1. **eGFR Value**
   - Large, prominent display
   - Units displayed appropriately
   - Color coded by CKD stage

2. **CKD Stage**
   - Clear stage number and description
   - Color coded background
   - GFR range for stage

3. **Clinical Context**
   - Interpretation bullets
   - Recommendations
   - Next steps guidance

4. **Formula Information**
   - Formula name and year
   - Description and rationale
   - Clinical context for selection

## Validation Rules

### Input Validation
- Age: 18 ≤ age ≤ 120 years
- Weight: 30 ≤ weight ≤ 300 kg
- Creatinine: 0.1 ≤ creatinine ≤ 20.0 mg/dL
- Sex: Must be "male" or "female"
- Race: If provided, must be "black" or "other"
- Formula: Must be one of supported formula keys

### Clinical Validation
- Flag extremely high or low creatinine values
- Warn about formula limitations
- Note when Cockcroft-Gault may overestimate
- Alert for Stage 4-5 CKD requiring urgent care

### Output Validation
- eGFR results should be medically reasonable (1-200 range)
- CKD stage should match eGFR value
- All required fields present in response
- Appropriate decimal precision maintained

## Clinical Considerations

### Formula Selection Guidelines
- **CKD-EPI 2021**: Default choice for all patients
- **CKD-EPI 2009**: Only for comparison with historical data
- **MDRD**: Historical interest only
- **Cockcroft-Gault**: Only when required for specific drug dosing

### Limitations and Warnings
- All formulas are estimates, not direct measurements
- Less accurate in:
  - Extremes of age, weight, muscle mass
  - Acute kidney injury
  - Pregnancy
  - Amputees or paralysis
- eGFR >60 should be reported as ">60" in some contexts
- Cockcroft-Gault may overestimate by 10-40%

### Clinical Actions by Stage
- **Stage 1-2**: Monitor annually, address cardiovascular risk
- **Stage 3a**: Monitor every 6 months, evaluate complications
- **Stage 3b**: Monitor every 3-6 months, consider nephrology
- **Stage 4**: Nephrology referral, prepare for RRT
- **Stage 5**: Urgent nephrology, dialysis planning

## Implementation Notes

- Follow existing calculator architecture pattern
- Implement all 4 formulas with medical accuracy
- Include comprehensive CKD staging logic
- Provide detailed clinical context and warnings
- Support print functionality for clinical documentation
- Include prominent medical disclaimers

## Medical Disclaimers

- eGFR calculations are estimates based on population studies
- Not suitable for all populations (pregnancy, extremes of body composition)
- Cannot replace clinical judgment or direct GFR measurement
- Different formulas may yield different results
- Consultation with healthcare providers recommended
- Not validated in all ethnic groups equally
- Educational and clinical support tool only