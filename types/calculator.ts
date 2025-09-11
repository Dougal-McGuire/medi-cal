// Type definitions for calculator components

export interface BMIFormula {
  key: string;
  name: string;
  description: string;
}

export interface BMIInput {
  weight: number;
  height: number;
  heightMeters: number;
}

export interface BMIInterpretation {
  ranges: {
    underweight: string;
    normal: string;
    overweight: string;
    obese: string;
  };
}

export interface BMIResult {
  bmi: string;
  category: string;
  formula: BMIFormula;
  input: BMIInput;
  interpretation: BMIInterpretation;
}

export interface BMICalculatorForm {
  weight: string;
  height: string;
  formula: string;
}

export interface FormErrors {
  [key: string]: string;
}

// BSA Calculator Types
export interface BSAFormula {
  key: string;
  name: string;
  description: string;
}

export interface BSAInput {
  weight: number;
  height: number;
  heightMeters: number;
}

export interface BSAInterpretation {
  normalRanges: {
    adult_male: string;
    adult_female: string;
    child: string;
  };
  applications: string[];
}

export interface BSAResult {
  bsa: number;
  formula: BSAFormula;
  input: BSAInput;
  interpretation: BSAInterpretation;
}

export interface BSACalculatorForm {
  weight: string;
  height: string;
  formula: string;
}

// Creatinine Clearance Calculator Types
export interface CreatinineFormula {
  key: string;
  name: string;
  description: string;
}

export interface CreatinineInput {
  age: number;
  weight: number;
  creatinine: number;
  creatinineUnit: 'mg_dl' | 'mmol_l';
  creatinineMgDl?: number; // Converted value for reference
  sex: 'male' | 'female';
  race?: 'black' | 'other';
}

export interface CreatinineInterpretation {
  ckdStage: {
    stage: number;
    description: string;
    gfrRange: string;
  };
  clinicalContext: string[];
}

export interface CreatinineResult {
  egfr: number;
  units: string;
  formula: CreatinineFormula;
  input: CreatinineInput;
  interpretation: CreatinineInterpretation;
}

export interface CreatinineCalculatorForm {
  age: string;
  weight: string;
  creatinine: string;
  creatinineUnit: string;
  sex: string;
  race: string;
  formula: string;
}