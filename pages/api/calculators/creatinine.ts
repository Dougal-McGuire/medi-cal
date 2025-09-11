import type { NextApiRequest, NextApiResponse } from 'next';
import { creatinineConversion } from '@/lib/utils';

interface FormulaConfig {
  name: string;
  description: string;
  calculate: (age: number, weight: number, creatinine: number, sex: 'male' | 'female', race?: 'black' | 'other') => number;
}

interface ValidationErrors {
  [key: string]: string;
}

interface CKDStage {
  stage: number;
  description: string;
  gfrRange: string;
}

interface CreatinineResponse {
  egfr: number;
  units: string;
  formula: {
    name: string;
    key: string;
    description: string;
  };
  input: {
    age: number;
    weight: number;
    creatinine: number;
    creatinineUnit: 'mg_dl' | 'mmol_l';
    creatinineMgDl?: number; // Converted value for reference
    sex: 'male' | 'female';
    race?: 'black' | 'other';
  };
  interpretation: {
    ckdStage: CKDStage;
    clinicalContext: string[];
  };
}

interface ErrorResponse {
  error: string;
  details?: ValidationErrors;
}

const CREATININE_FORMULAS: Record<string, FormulaConfig> = {
  ckd_epi_2021: {
    name: 'CKD-EPI 2021',
    description: 'Latest recommended formula without race factor (NKF/ASN 2021)',
    calculate: (age, weight, creatinine, sex) => {
      // CKD-EPI 2021 formula (race-free)
      const A = sex === 'female' ? 142 : 141;
      const B = sex === 'female' ? -0.241 : -0.302;
      const C = sex === 'female' ? 1.012 : 1;
      
      const minTerm = Math.min(creatinine / (sex === 'female' ? 0.7 : 0.9), 1);
      const maxTerm = Math.max(creatinine / (sex === 'female' ? 0.7 : 0.9), 1);
      
      return A * Math.pow(minTerm, B) * Math.pow(maxTerm, -1.200) * Math.pow(0.9938, age) * C;
    }
  },
  ckd_epi_2009: {
    name: 'CKD-EPI 2009',
    description: 'Previous CKD-EPI formula with race factor (historical)',
    calculate: (age, weight, creatinine, sex, race) => {
      // CKD-EPI 2009 formula (with race)
      const A = sex === 'female' ? 142 : 141;
      const B = sex === 'female' ? -0.241 : -0.302;
      const C = sex === 'female' ? 1.012 : 1;
      const D = race === 'black' ? 1.159 : 1;
      
      const minTerm = Math.min(creatinine / (sex === 'female' ? 0.7 : 0.9), 1);
      const maxTerm = Math.max(creatinine / (sex === 'female' ? 0.7 : 0.9), 1);
      
      return A * Math.pow(minTerm, B) * Math.pow(maxTerm, -1.200) * Math.pow(0.9938, age) * C * D;
    }
  },
  mdrd: {
    name: 'MDRD',
    description: 'Modification of Diet in Renal Disease study equation (historical)',
    calculate: (age, weight, creatinine, sex, race) => {
      let egfr = 175 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203);
      if (sex === 'female') egfr *= 0.742;
      if (race === 'black') egfr *= 1.212;
      return egfr;
    }
  },
  cockcroft_gault: {
    name: 'Cockcroft-Gault',
    description: 'Creatinine clearance formula for drug dosing (not normalized to BSA)',
    calculate: (age, weight, creatinine, sex) => {
      let crcl = ((140 - age) * weight) / (72 * creatinine);
      if (sex === 'female') crcl *= 0.85;
      return crcl;
    }
  }
};

function getCKDStage(egfr: number, formula: string): CKDStage {
  if (formula === 'cockcroft_gault') {
    // Cockcroft-Gault doesn't use CKD staging, just provide guidance
    if (egfr >= 90) return { stage: 1, description: 'Normal or High Function', gfrRange: '≥90 mL/min' };
    else if (egfr >= 60) return { stage: 2, description: 'Mildly Decreased Function', gfrRange: '60-89 mL/min' };
    else if (egfr >= 45) return { stage: 3, description: 'Moderately Decreased Function', gfrRange: '45-59 mL/min' };
    else if (egfr >= 30) return { stage: 3, description: 'Moderately Decreased Function', gfrRange: '30-44 mL/min' };
    else if (egfr >= 15) return { stage: 4, description: 'Severely Decreased Function', gfrRange: '15-29 mL/min' };
    else return { stage: 5, description: 'Kidney Failure', gfrRange: '<15 mL/min' };
  }

  // Standard CKD staging for normalized formulas
  if (egfr >= 90) return { stage: 1, description: 'Stage 1: Normal or High', gfrRange: '≥90 mL/min/1.73 m²' };
  else if (egfr >= 60) return { stage: 2, description: 'Stage 2: Mildly Decreased', gfrRange: '60-89 mL/min/1.73 m²' };
  else if (egfr >= 45) return { stage: 3, description: 'Stage 3a: Moderately Decreased', gfrRange: '45-59 mL/min/1.73 m²' };
  else if (egfr >= 30) return { stage: 3, description: 'Stage 3b: Moderately Decreased', gfrRange: '30-44 mL/min/1.73 m²' };
  else if (egfr >= 15) return { stage: 4, description: 'Stage 4: Severely Decreased', gfrRange: '15-29 mL/min/1.73 m²' };
  else return { stage: 5, description: 'Stage 5: Kidney Failure', gfrRange: '<15 mL/min/1.73 m²' };
}

function getClinicalContext(ckdStage: CKDStage, formula: string): string[] {
  if (formula === 'cockcroft_gault') {
    return [
      'This formula estimates creatinine clearance (CrCl)',
      'Primarily used for drug dosing adjustments',
      'Not normalized to body surface area',
      'May overestimate kidney function by 10-40%',
      'Consider eGFR formulas for CKD assessment'
    ];
  }

  switch (ckdStage.stage) {
    case 1:
      return [
        'Normal or high kidney function',
        'Requires evidence of kidney damage for CKD diagnosis',
        'Monitor annually if kidney damage present',
        'Address cardiovascular risk factors'
      ];
    case 2:
      return [
        'Mildly decreased kidney function',
        'Monitor annually for progression',
        'Address cardiovascular risk factors',
        'Screen for complications of CKD'
      ];
    case 3:
      if (ckdStage.description.includes('3a')) {
        return [
          'Moderately decreased kidney function',
          'Monitor every 6 months',
          'Evaluate and treat CKD complications',
          'Consider cardiovascular risk reduction'
        ];
      } else {
        return [
          'Moderately decreased kidney function',
          'Monitor every 3-6 months',
          'Consider nephrology referral',
          'Prepare for renal replacement therapy'
        ];
      }
    case 4:
      return [
        'Severely decreased kidney function',
        'Nephrology referral recommended',
        'Prepare for dialysis or transplant',
        'Manage CKD complications actively'
      ];
    case 5:
      return [
        'Kidney failure',
        'Urgent nephrology consultation',
        'Dialysis or transplant indicated',
        'Manage uremic complications'
      ];
    default:
      return ['Consult healthcare provider for interpretation'];
  }
}

function validateInput(age: any, weight: any, creatinine: any, creatinineUnit: any, sex: any, race: any, formula: any): ValidationErrors | null {
  const errors: ValidationErrors = {};
  
  if (!age || typeof age !== 'number' || age < 18 || age > 120) {
    errors.age = 'Must be between 18 and 120 years';
  }
  
  if (!weight || typeof weight !== 'number' || weight < 30 || weight > 300) {
    errors.weight = 'Must be between 30 and 300 kg';
  }
  
  if (!creatinineUnit || !['mg_dl', 'mmol_l'].includes(creatinineUnit)) {
    errors.creatinineUnit = 'Invalid creatinine unit';
  }
  
  if (!creatinine || typeof creatinine !== 'number') {
    errors.creatinine = 'Creatinine must be a number';
  } else if (creatinineUnit) {
    const range = creatinineConversion.getValidationRange(creatinineUnit);
    if (creatinine < range.min || creatinine > range.max) {
      errors.creatinine = `Must be between ${range.min} and ${range.max} ${range.unit}`;
    }
  }
  
  if (!sex || !['male', 'female'].includes(sex)) {
    errors.sex = 'Must be male or female';
  }
  
  if (race && !['black', 'other'].includes(race)) {
    errors.race = 'Must be black or other';
  }
  
  if (formula && !CREATININE_FORMULAS[formula]) {
    errors.formula = 'Must be one of: ckd_epi_2021, ckd_epi_2009, mdrd, cockcroft_gault';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreatinineResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { age, weight, creatinine, creatinineUnit = 'mg_dl', sex, race, formula = 'ckd_epi_2021' } = req.body;

  // Validate input parameters
  const validationErrors = validateInput(age, weight, creatinine, creatinineUnit, sex, race, formula);
  if (validationErrors) {
    return res.status(400).json({
      error: 'Invalid input parameters',
      details: validationErrors
    });
  }

  // Convert creatinine to mg/dL for calculations (all formulas expect mg/dL)
  const creatinineMgDl = creatinineConversion.toMgDl(creatinine, creatinineUnit);

  // Get formula configuration
  const formulaConfig = CREATININE_FORMULAS[formula];
  
  // Calculate eGFR/CrCl using selected formula (with converted creatinine in mg/dL)
  const egfr = formulaConfig.calculate(age, weight, creatinineMgDl, sex, race);
  
  // Determine CKD stage
  const ckdStage = getCKDStage(egfr, formula);
  
  // Get clinical context
  const clinicalContext = getClinicalContext(ckdStage, formula);
  
  // Determine units
  const units = formula === 'cockcroft_gault' ? 'mL/min' : 'mL/min/1.73 m²';

  res.status(200).json({
    egfr: Math.round(egfr),
    units,
    formula: {
      name: formulaConfig.name,
      key: formula,
      description: formulaConfig.description
    },
    input: {
      age,
      weight,
      creatinine,
      creatinineUnit,
      creatinineMgDl: creatinineMgDl !== creatinine ? Math.round(creatinineMgDl * 100) / 100 : undefined,
      sex,
      race
    },
    interpretation: {
      ckdStage,
      clinicalContext
    }
  });
}