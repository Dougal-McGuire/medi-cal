import type { NextApiRequest, NextApiResponse } from 'next';
import { creatinineConversion } from '@/lib/utils';
import { CreatinineApiInputSchema } from '@/lib/schemas';
import { z } from 'zod';

interface FormulaConfig {
  name: string;
  description: string;
  calculate: (age: number, weight: number, creatinine: number, sex: 'male' | 'female', race?: 'black' | 'other') => number;
}

interface CKDStage {
  stage: string;
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

const CKD_EPI_CONSTANTS = {
  FEMALE: { A: 142, B: -0.241, C: 1.012, KAPPA: 0.7 },
  MALE:   { A: 141, B: -0.302, C: 1,     KAPPA: 0.9 },
  COMMON: { MAX_EXP: -1.200, AGE_EXP: 0.9938 },
  RACE_COEFFICIENT: { BLACK: 1.159, OTHER: 1 }
};

const CREATININE_FORMULAS: Record<string, FormulaConfig> = {
  ckd_epi_2021: {
    name: 'CKD-EPI 2021',
    description: 'Latest recommended formula without race factor (NKF/ASN 2021)',
    calculate: (age, weight, creatinine, sex) => {
      const params = sex === 'female' ? CKD_EPI_CONSTANTS.FEMALE : CKD_EPI_CONSTANTS.MALE;
      
      const scr_div_kappa = creatinine / params.KAPPA;
      const minTerm = Math.min(scr_div_kappa, 1);
      const maxTerm = Math.max(scr_div_kappa, 1);
      
      return params.A *
             Math.pow(minTerm, params.B) *
             Math.pow(maxTerm, CKD_EPI_CONSTANTS.COMMON.MAX_EXP) *
             Math.pow(CKD_EPI_CONSTANTS.COMMON.AGE_EXP, age) *
             params.C;
    }
  },
  ckd_epi_2009: {
    name: 'CKD-EPI 2009',
    description: 'Previous CKD-EPI formula with race factor (historical)',
    calculate: (age, weight, creatinine, sex, race) => {
      const params = sex === 'female' ? CKD_EPI_CONSTANTS.FEMALE : CKD_EPI_CONSTANTS.MALE;
      const race_coeff = race === 'black' ? CKD_EPI_CONSTANTS.RACE_COEFFICIENT.BLACK : CKD_EPI_CONSTANTS.RACE_COEFFICIENT.OTHER;
      
      const scr_div_kappa = creatinine / params.KAPPA;
      const minTerm = Math.min(scr_div_kappa, 1);
      const maxTerm = Math.max(scr_div_kappa, 1);
      
      return params.A *
             Math.pow(minTerm, params.B) *
             Math.pow(maxTerm, CKD_EPI_CONSTANTS.COMMON.MAX_EXP) *
             Math.pow(CKD_EPI_CONSTANTS.COMMON.AGE_EXP, age) *
             params.C *
             race_coeff;
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
    // Cockcroft-Gault provides CrCl, not eGFR. Staging is for guidance.
    if (egfr >= 90) return { stage: 'N/A', description: 'Normal or High Function', gfrRange: '≥90 mL/min' };
    if (egfr >= 60) return { stage: 'N/A', description: 'Mildly Decreased Function', gfrRange: '60-89 mL/min' };
    if (egfr >= 30) return { stage: 'N/A', description: 'Moderately Decreased Function', gfrRange: '30-59 mL/min' };
    if (egfr >= 15) return { stage: 'N/A', description: 'Severely Decreased Function', gfrRange: '15-29 mL/min' };
    return { stage: 'N/A', description: 'Kidney Failure', gfrRange: '<15 mL/min' };
  }

  // Standard CKD staging for eGFR formulas
  if (egfr >= 90) return { stage: '1', description: 'Stage 1: Normal or High', gfrRange: '≥90 mL/min/1.73 m²' };
  if (egfr >= 60) return { stage: '2', description: 'Stage 2: Mildly Decreased', gfrRange: '60-89 mL/min/1.73 m²' };
  if (egfr >= 45) return { stage: '3a', description: 'Stage 3a: Moderately Decreased', gfrRange: '45-59 mL/min/1.73 m²' };
  if (egfr >= 30) return { stage: '3b', description: 'Stage 3b: Moderately Decreased', gfrRange: '30-44 mL/min/1.73 m²' };
  if (egfr >= 15) return { stage: '4', description: 'Stage 4: Severely Decreased', gfrRange: '15-29 mL/min/1.73 m²' };
  return { stage: '5', description: 'Stage 5: Kidney Failure', gfrRange: '<15 mL/min/1.73 m²' };
}

function getClinicalContext(ckdStage: CKDStage, formula: string): string[] {
  if (formula === 'cockcroft_gault') {
    return [
      'This formula estimates creatinine clearance (CrCl), not eGFR.',
      'Primarily used for drug dosing adjustments.',
      'Not normalized to body surface area and may overestimate kidney function.',
      'Consider using a GFR-based formula like CKD-EPI for CKD staging.'
    ];
  }

  switch (ckdStage.stage) {
    case '1':
      return [
        'Normal or high kidney function (in the absence of kidney damage).',
        'If kidney damage is present (e.g., proteinuria), this indicates CKD Stage 1.',
        'Monitor annually if risk factors are present.',
        'Focus on cardiovascular risk reduction.'
      ];
    case '2':
      return [
        'Mildly decreased kidney function.',
        'Indicates CKD Stage 2 if kidney damage is present.',
        'Monitor annually for progression.',
        'Address and manage cardiovascular risk factors.'
      ];
    case '3a':
      return [
        'Moderately decreased kidney function.',
        'Monitor every 6-12 months.',
        'Evaluate and treat CKD complications (e.g., anemia, bone disease).',
        'Focus on blood pressure control and cardiovascular health.'
      ];
    case '3b':
      return [
        'Moderately to severely decreased kidney function.',
        'Monitor every 3-6 months.',
        'Consider referral to a nephrologist.',
        'Begin education on renal replacement therapy options.'
      ];
    case '4':
      return [
        'Severely decreased kidney function.',
        'Requires nephrology referral.',
        'Prepare for renal replacement therapy (dialysis, transplant).',
        'Actively manage complications like anemia and hyperkalemia.'
      ];
    case '5':
      return [
        'Kidney failure.',
        'Urgent nephrology consultation required.',
        'Renal replacement therapy (dialysis or transplant) is indicated.',
        'Manage uremic symptoms and complications.'
      ];
    default:
      return ['Consult a healthcare provider for a detailed interpretation.'];
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreatinineResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parseResult = CreatinineApiInputSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid input parameters',
      details: parseResult.error.flatten().fieldErrors,
    });
  }

  const { age, weight, creatinine, creatinineUnit, sex, race, formula } = parseResult.data;

  // Convert creatinine to mg/dL for calculations
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