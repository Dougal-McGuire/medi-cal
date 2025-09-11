import type { NextApiRequest, NextApiResponse } from 'next';

interface FormulaConfig {
  name: string;
  description: string;
  calculate: (weight: number, heightCm: number) => number;
}

interface ValidationErrors {
  [key: string]: string;
}

interface BSAResponse {
  bsa: number;
  formula: {
    name: string;
    key: string;
    description: string;
  };
  input: {
    weight: number;
    height: number;
    heightMeters: number;
  };
  interpretation: {
    normalRanges: {
      adult_male: string;
      adult_female: string;
      child: string;
    };
    applications: string[];
  };
}

interface ErrorResponse {
  error: string;
  details?: ValidationErrors;
}

const BSA_FORMULAS: Record<string, FormulaConfig> = {
  dubois: {
    name: 'Du Bois Formula (1916)',
    description: 'Most widely used BSA formula, standard medical reference',
    calculate: (weight, heightCm) => 0.007184 * Math.pow(heightCm, 0.725) * Math.pow(weight, 0.425)
  },
  mosteller: {
    name: 'Mosteller Formula (1987)',
    description: 'Simplified formula that is easy to calculate mentally',
    calculate: (weight, heightCm) => Math.sqrt((heightCm * weight) / 3600)
  },
  haycock: {
    name: 'Haycock Formula (1978)',
    description: 'Formula developed specifically for pediatric populations',
    calculate: (weight, heightCm) => 0.024265 * Math.pow(heightCm, 0.3964) * Math.pow(weight, 0.5378)
  },
  boyd: {
    name: 'Boyd Formula (1935)',
    description: 'Complex formula with logarithmic weight scaling',
    calculate: (weight, heightCm) => {
      const weightGrams = weight * 1000;
      return 0.0003207 * Math.pow(heightCm, 0.3) * Math.pow(weightGrams, 0.7285 - (0.0188 * Math.log10(weightGrams)));
    }
  },
  gehan: {
    name: 'Gehan-George Formula (1970)',
    description: 'Alternative formula with different scaling exponents',
    calculate: (weight, heightCm) => 0.0235 * Math.pow(heightCm, 0.42246) * Math.pow(weight, 0.51456)
  }
};

function validateInput(weight: any, height: any, formula: any): ValidationErrors | null {
  const errors: ValidationErrors = {};
  
  if (!weight || typeof weight !== 'number' || weight < 1.0 || weight > 1000.0) {
    errors.weight = 'Must be between 1.0 and 1000.0 kg';
  }
  
  if (!height || typeof height !== 'number' || height < 50 || height > 300) {
    errors.height = 'Must be between 50 and 300 cm';
  }
  
  if (formula && !BSA_FORMULAS[formula]) {
    errors.formula = 'Must be one of: dubois, mosteller, haycock, boyd, gehan';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}

function getInterpretation() {
  return {
    normalRanges: {
      adult_male: '1.9 - 2.2 m²',
      adult_female: '1.6 - 1.9 m²',
      child: 'Varies by age'
    },
    applications: [
      'Drug dosing calculations',
      'Cardiac index determination',
      'Physiological measurement indexing',
      'Chemotherapy protocols',
      'Burn assessment calculations'
    ]
  };
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BSAResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { weight, height, formula = 'dubois' } = req.body;

  // Validate input parameters
  const validationErrors = validateInput(weight, height, formula);
  if (validationErrors) {
    return res.status(400).json({
      error: 'Invalid input parameters',
      details: validationErrors
    });
  }

  // Convert height from cm to meters for display
  const heightM = height / 100;
  
  // Get formula configuration
  const formulaConfig = BSA_FORMULAS[formula];
  
  // Calculate BSA using selected formula
  const bsa = formulaConfig.calculate(weight, height);
  
  // Get interpretation data
  const interpretation = getInterpretation();

  res.status(200).json({
    bsa: Math.round(bsa * 100) / 100, // Round to 2 decimal places
    formula: {
      name: formulaConfig.name,
      key: formula,
      description: formulaConfig.description
    },
    input: {
      weight,
      height,
      heightMeters: heightM
    },
    interpretation
  });
}