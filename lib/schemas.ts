import { z } from 'zod';

// BMI Calculator validation schemas
export const BMIFormSchema = z.object({
  weight: z
    .string()
    .min(1, 'Weight is required')
    .refine((val) => !isNaN(Number(val)), 'Weight must be a number')
    .refine((val) => Number(val) >= 1, 'Weight must be at least 1 kg')
    .refine((val) => Number(val) <= 1000, 'Weight must be less than 1000 kg'),
  
  height: z
    .string()
    .min(1, 'Height is required')
    .refine((val) => !isNaN(Number(val)), 'Height must be a number')
    .refine((val) => Number(val) >= 50, 'Height must be at least 50 cm')
    .refine((val) => Number(val) <= 300, 'Height must be less than 300 cm'),
  
  formula: z
    .string()
    .min(1, 'Formula selection is required')
    .refine(
      (val) => ['traditional', 'trefethen', 'prime', 'reciprocal', 'geometric'].includes(val),
      'Invalid formula selection'
    ),
});

// API input validation for BMI calculation
export const BMIApiInputSchema = z.object({
  weight: z
    .number()
    .min(1, 'Weight must be at least 1 kg')
    .max(1000, 'Weight must be less than 1000 kg'),
  
  height: z
    .number()
    .min(50, 'Height must be at least 50 cm')
    .max(300, 'Height must be less than 300 cm'),
  
  formula: z
    .string()
    .refine(
      (val) => ['traditional', 'trefethen', 'prime', 'reciprocal', 'geometric'].includes(val),
      'Invalid formula selection'
    ),
});

// Type inference from schemas
export type BMIFormData = z.infer<typeof BMIFormSchema>;
export type BMIApiInput = z.infer<typeof BMIApiInputSchema>;

// BSA Calculator validation schemas
export const BSAFormSchema = z.object({
  weight: z
    .string()
    .min(1, 'Weight is required')
    .refine((val) => !isNaN(Number(val)), 'Weight must be a number')
    .refine((val) => Number(val) >= 1, 'Weight must be at least 1 kg')
    .refine((val) => Number(val) <= 1000, 'Weight must be less than 1000 kg'),
  
  height: z
    .string()
    .min(1, 'Height is required')
    .refine((val) => !isNaN(Number(val)), 'Height must be a number')
    .refine((val) => Number(val) >= 50, 'Height must be at least 50 cm')
    .refine((val) => Number(val) <= 300, 'Height must be less than 300 cm'),
  
  formula: z
    .string()
    .min(1, 'Formula selection is required')
    .refine(
      (val) => ['dubois', 'mosteller', 'haycock', 'boyd', 'gehan'].includes(val),
      'Invalid formula selection'
    ),
});

// API input validation for BSA calculation
export const BSAApiInputSchema = z.object({
  weight: z
    .number()
    .min(1, 'Weight must be at least 1 kg')
    .max(1000, 'Weight must be less than 1000 kg'),
  
  height: z
    .number()
    .min(50, 'Height must be at least 50 cm')
    .max(300, 'Height must be less than 300 cm'),
  
  formula: z
    .string()
    .refine(
      (val) => ['dubois', 'mosteller', 'haycock', 'boyd', 'gehan'].includes(val),
      'Invalid formula selection'
    ),
});

export type BSAFormData = z.infer<typeof BSAFormSchema>;
export type BSAApiInput = z.infer<typeof BSAApiInputSchema>;

// Creatinine Clearance Calculator validation schemas
export const CreatinineFormSchema = z.object({
  age: z
    .string()
    .min(1, 'Age is required')
    .refine((val) => !isNaN(Number(val)), 'Age must be a number')
    .refine((val) => Number(val) >= 18, 'Age must be at least 18 years')
    .refine((val) => Number(val) <= 120, 'Age must be less than 120 years'),
  
  weight: z
    .string()
    .min(1, 'Weight is required')
    .refine((val) => !isNaN(Number(val)), 'Weight must be a number')
    .refine((val) => Number(val) >= 30, 'Weight must be at least 30 kg')
    .refine((val) => Number(val) <= 300, 'Weight must be less than 300 kg'),
  
  creatinine: z
    .string()
    .min(1, 'Serum creatinine is required')
    .refine((val) => !isNaN(Number(val)), 'Creatinine must be a number'),
  
  creatinineUnit: z
    .string()
    .min(1, 'Creatinine unit is required')
    .refine((val) => ['mg_dl', 'mmol_l'].includes(val), 'Invalid creatinine unit'),
  
  sex: z
    .string()
    .min(1, 'Sex is required')
    .refine((val) => ['male', 'female'].includes(val), 'Sex must be male or female'),
  
  race: z
    .string()
    .optional()
    .refine(
      (val) => !val || ['black', 'other'].includes(val),
      'Race must be black or other'
    ),
  
  formula: z
    .string()
    .min(1, 'Formula selection is required')
    .refine(
      (val) => ['ckd_epi_2021', 'ckd_epi_2009', 'mdrd', 'cockcroft_gault'].includes(val),
      'Invalid formula selection'
    ),
}).refine((data) => {
  const creatinine = Number(data.creatinine);
  const unit = data.creatinineUnit;
  
  if (unit === 'mg_dl') {
    return creatinine >= 0.1 && creatinine <= 20.0;
  } else if (unit === 'mmol_l') {
    return creatinine >= 9 && creatinine <= 1770;
  }
  return true;
}, {
  message: 'Creatinine value out of range for selected unit',
  path: ['creatinine']
});

// API input validation for Creatinine calculation
export const CreatinineApiInputSchema = z.object({
  age: z
    .number()
    .min(18, 'Age must be at least 18 years')
    .max(120, 'Age must be less than 120 years'),
  
  weight: z
    .number()
    .min(30, 'Weight must be at least 30 kg')
    .max(300, 'Weight must be less than 300 kg'),
  
  creatinine: z
    .number()
    .min(0.001, 'Creatinine value too low')
    .max(2000, 'Creatinine value too high'),
  
  creatinineUnit: z
    .enum(['mg_dl', 'mmol_l'], { message: 'Invalid creatinine unit' }),
  
  sex: z
    .enum(['male', 'female'], { message: 'Sex is required' }),
  
  race: z
    .enum(['black', 'other'])
    .optional(),
  
  formula: z
    .string()
    .refine(
      (val) => ['ckd_epi_2021', 'ckd_epi_2009', 'mdrd', 'cockcroft_gault'].includes(val),
      'Invalid formula selection'
    ),
});

export type CreatinineFormData = z.infer<typeof CreatinineFormSchema>;
export type CreatinineApiInput = z.infer<typeof CreatinineApiInputSchema>;