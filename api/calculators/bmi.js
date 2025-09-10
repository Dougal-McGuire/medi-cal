export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { weight, height, unit = 'metric' } = req.body;

  if (!weight || !height) {
    return res.status(400).json({ 
      error: 'Missing required parameters: weight and height' 
    });
  }

  let bmi;
  if (unit === 'imperial') {
    // BMI = (weight in pounds / (height in inches)²) × 703
    bmi = (weight / (height * height)) * 703;
  } else {
    // BMI = weight in kg / (height in meters)²
    bmi = weight / (height * height);
  }

  let category;
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';

  res.status(200).json({
    bmi: Math.round(bmi * 10) / 10,
    category,
    unit,
    input: { weight, height }
  });
}