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