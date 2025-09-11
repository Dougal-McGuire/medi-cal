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