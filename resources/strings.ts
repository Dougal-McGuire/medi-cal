// Reusable strings for the MediCal application

export const STRINGS = {
  // App branding
  APP_NAME: 'MediCal',
  
  // Page titles and descriptions
  HOME_TITLE: 'Medical Calculator Tools',
  HOME_SUBTITLE: 'Professional medical calculators with modern interface',
  HOME_META_DESCRIPTION: 'Professional medical calculators with modern interface',
  
  // Navigation
  NAV_HOME: 'Home',
  NAV_BMI_CALCULATOR: 'BMI Calculator',
  
  // Section headings
  AVAILABLE_CALCULATORS: 'Available Calculators',
  
  // Calculator descriptions
  BMI_CALCULATOR_TITLE: 'BMI Calculator',
  BMI_CALCULATOR_DESCRIPTION: 'Calculate Body Mass Index with multiple formulas and metric units',
  BMI_CALCULATOR_BUTTON: 'Calculate BMI',
  
  BSA_CALCULATOR_TITLE: 'BSA Calculator',
  BSA_CALCULATOR_DESCRIPTION: 'Body Surface Area calculation (Coming Soon)',
  
  CREATININE_CALCULATOR_TITLE: 'Creatinine Clearance',
  CREATININE_CALCULATOR_DESCRIPTION: 'Kidney function assessment (Coming Soon)',
  
  // Common buttons
  COMING_SOON: 'Coming Soon',
  
  // Footer
  FOOTER_COPYRIGHT: '©2025 CCDRD AG. For research only.',
  
  // Meta
  VIEWPORT_META: 'width=device-width, initial-scale=1',
} as const;

export type StringKeys = keyof typeof STRINGS;

export default STRINGS;