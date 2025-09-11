import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creatinine unit conversion utilities
 */
export const creatinineConversion = {
  /**
   * Convert mmol/L to mg/dL
   * Formula: mg/dL = mmol/L × 0.0113
   */
  mmolToMgDl: (mmolL: number): number => {
    return mmolL * 0.0113;
  },

  /**
   * Convert mg/dL to mmol/L  
   * Formula: mmol/L = mg/dL × 88.4
   */
  mgDlToMmol: (mgDl: number): number => {
    return mgDl * 88.4;
  },

  /**
   * Convert any creatinine value to mg/dL (standard for calculations)
   */
  toMgDl: (value: number, unit: 'mg_dl' | 'mmol_l'): number => {
    if (unit === 'mg_dl') {
      return value;
    } else if (unit === 'mmol_l') {
      return creatinineConversion.mmolToMgDl(value);
    }
    throw new Error(`Unknown creatinine unit: ${unit}`);
  },

  /**
   * Get unit display name
   */
  getUnitLabel: (unit: 'mg_dl' | 'mmol_l'): string => {
    return unit === 'mg_dl' ? 'mg/dL' : 'μmol/L';
  },

  /**
   * Get validation ranges for a unit
   */
  getValidationRange: (unit: 'mg_dl' | 'mmol_l') => {
    if (unit === 'mg_dl') {
      return { min: 0.1, max: 20.0, unit: 'mg/dL' };
    } else {
      return { min: 9, max: 1770, unit: 'μmol/L' };
    }
  }
};