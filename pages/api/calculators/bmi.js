const BMI_FORMULAS = {
  traditional: {
    name: 'Traditional Quetelet Index',
    description: 'Standard BMI calculation (weight/height²)',
    calculate: (weight, heightM) => weight / (heightM * heightM)
  },
  trefethen: {
    name: "Trefethen's New BMI",
    description: 'Modified BMI that reduces height bias (1.3×weight/height^2.5)',
    calculate: (weight, heightM) => 1.3 * weight / Math.pow(heightM, 2.5)
  },
  prime: {
    name: 'BMI Prime',
    description: 'Ratio-based BMI (Traditional BMI ÷ 25)',
    calculate: (weight, heightM) => (weight / (heightM * heightM)) / 25
  },
  reciprocal: {
    name: 'Reciprocal BMI (Ponderal Index)',
    description: 'Height-cubed scaling (height³/weight)',
    calculate: (weight, heightM) => Math.pow(heightM, 3) / weight
  },
  geometric: {
    name: 'Geometric Mean BMI',
    description: 'Compromise scaling (weight/(height×√height))',
    calculate: (weight, heightM) => weight / (heightM * Math.sqrt(heightM))
  }
};

function getCategory(bmi, formula) {
  if (formula === 'prime') {
    if (bmi < 0.74) return 'Underweight';
    else if (bmi < 1.0) return 'Normal weight';
    else if (bmi < 1.2) return 'Overweight';
    else return 'Obese';
  } else if (formula === 'reciprocal') {
    if (bmi > 0.14) return 'Underweight';
    else if (bmi > 0.10) return 'Normal weight';
    else if (bmi > 0.075) return 'Overweight';
    else return 'Obese';
  } else {
    // Traditional, Trefethen, Geometric use WHO standards
    if (bmi < 18.5) return 'Underweight';
    else if (bmi < 25) return 'Normal weight';
    else if (bmi < 30) return 'Overweight';
    else return 'Obese';
  }
}

function getCategoryRanges(formula) {
  if (formula === 'prime') {
    return {
      underweight: '< 0.74',
      normal: '0.74 - 0.99',
      overweight: '1.0 - 1.19',
      obese: '≥ 1.2'
    };
  } else if (formula === 'reciprocal') {
    return {
      underweight: '> 0.14',
      normal: '0.10 - 0.14',
      overweight: '0.075 - 0.10',
      obese: '≤ 0.075'
    };
  } else {
    return {
      underweight: '< 18.5',
      normal: '18.5 - 24.9',
      overweight: '25.0 - 29.9',
      obese: '≥ 30.0'
    };
  }
}

function validateInput(weight, height, formula) {
  const errors = {};
  
  if (!weight || typeof weight !== 'number' || weight < 1.0 || weight > 1000.0) {
    errors.weight = 'Must be between 1.0 and 1000.0 kg';
  }
  
  if (!height || typeof height !== 'number' || height < 50 || height > 300) {
    errors.height = 'Must be between 50 and 300 cm';
  }
  
  if (formula && !BMI_FORMULAS[formula]) {
    errors.formula = 'Must be one of: traditional, trefethen, prime, reciprocal, geometric';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { weight, height, formula = 'traditional' } = req.body;

  // Validate input parameters
  const validationErrors = validateInput(weight, height, formula);
  if (validationErrors) {
    return res.status(400).json({
      error: 'Invalid input parameters',
      details: validationErrors
    });
  }

  // Convert height from cm to meters
  const heightM = height / 100;
  
  // Get formula configuration
  const formulaConfig = BMI_FORMULAS[formula];
  
  // Calculate BMI using selected formula
  const bmi = formulaConfig.calculate(weight, heightM);
  
  // Determine category
  const category = getCategory(bmi, formula);
  
  // Get category ranges for this formula
  const ranges = getCategoryRanges(formula);

  res.status(200).json({
    bmi: Math.round(bmi * 10) / 10,
    category,
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
    interpretation: {
      ranges
    }
  });
}