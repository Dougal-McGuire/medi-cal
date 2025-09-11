import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PrintButton from '../../commons/components/PrintButton';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const BMI_FORMULAS = [
  { key: 'traditional', name: 'Traditional Quetelet Index', description: 'Standard BMI calculation (weight/height²)' },
  { key: 'trefethen', name: "Trefethen's New BMI", description: 'Modified BMI that reduces height bias' },
  { key: 'prime', name: 'BMI Prime', description: 'Ratio-based BMI (Traditional BMI ÷ 25)' },
  { key: 'reciprocal', name: 'Reciprocal BMI', description: 'Height-cubed scaling (better for tall/short people)' },
  { key: 'geometric', name: 'Geometric Mean BMI', description: 'Compromise scaling formula' }
];

export default function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [formula, setFormula] = useState('traditional');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const calculateBMI = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/calculators/bmi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          weight: parseFloat(weight),
          height: parseFloat(height),
          formula
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        if (data.details) {
          setErrors(data.details);
        } else {
          alert('Error: ' + data.error);
        }
      }
    } catch (error) {
      alert('Error calculating BMI: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Underweight': '#17a2b8',
      'Normal weight': '#28a745', 
      'Overweight': '#ffc107',
      'Obese': '#dc3545'
    };
    return colors[category] || '#333';
  };

  return (
    <>
      <Head>
        <title>BMI Calculator - MediCal</title>
        <meta name="description" content="Calculate Body Mass Index with metric or imperial units" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="header">
        <div className="container">
          <h1 className="logo">MediCal</h1>
          <nav className="nav">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/calculators/bmi" className="nav-link">BMI Calculator</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container max-w-4xl mx-auto py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">BMI Calculator</h1>
            <p className="text-muted-foreground mt-2">
              Calculate Body Mass Index with multiple formula options
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Measurements</CardTitle>
                <CardDescription>
                  Provide your weight and height to calculate your BMI using various formulas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={calculateBMI} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      type="number"
                      id="weight"
                      step="0.1"
                      min="1.0"
                      max="1000.0"
                      placeholder="70.0"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                    />
                    {errors.weight && (
                      <div className="text-destructive text-sm">
                        {errors.weight}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      type="number"
                      id="height"
                      step="0.1"
                      min="50"
                      max="300"
                      placeholder="175.0"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      required
                    />
                    {errors.height && (
                      <div className="text-destructive text-sm">
                        {errors.height}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="formula">BMI Formula</Label>
                    <Select value={formula} onValueChange={setFormula}>
                      <SelectTrigger id="formula">
                        <SelectValue placeholder="Select a BMI formula" />
                      </SelectTrigger>
                      <SelectContent>
                        {BMI_FORMULAS.map((f) => (
                          <SelectItem key={f.key} value={f.key}>
                            {f.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground">
                      {BMI_FORMULAS.find(f => f.key === formula)?.description}
                    </div>
                    {errors.formula && (
                      <div className="text-destructive text-sm">
                        {errors.formula}
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Calculating...' : 'Calculate BMI'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {result && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {result.formula.name === 'BMI Prime' ? `BMI Prime: ${result.bmi}` : 
                       result.formula.name === 'Reciprocal BMI (Ponderal Index)' ? `Ponderal Index: ${result.bmi}` :
                       `BMI: ${result.bmi}`}
                      {result.formula.name !== 'BMI Prime' && result.formula.name !== 'Reciprocal BMI (Ponderal Index)' && (
                        <span className="text-base text-muted-foreground font-normal"> kg/m²</span>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription className="text-center">
                    <div 
                      className="text-lg font-semibold"
                      style={{ color: getCategoryColor(result.category) }}
                    >
                      Category: {result.category}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-4 space-y-4">
                    <div>
                      <div className="font-semibold mb-2">
                        Formula: {result.formula.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.formula.description}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-semibold mb-2">
                        Category Ranges for {result.formula.name}:
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span style={{ color: '#17a2b8' }}>Underweight:</span> {result.interpretation.ranges.underweight}</div>
                        <div><span style={{ color: '#28a745' }}>Normal:</span> {result.interpretation.ranges.normal}</div>
                        <div><span style={{ color: '#ffc107' }}>Overweight:</span> {result.interpretation.ranges.overweight}</div>
                        <div><span style={{ color: '#dc3545' }}>Obese:</span> {result.interpretation.ranges.obese}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-4">
                    Input: {result.input.weight} kg, {result.input.height} cm ({result.input.heightMeters} m)
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <PrintButton
                      calculatorName="BMI Calculator"
                      result={result}
                      inputs={{
                        weight: result.input.weight,
                        height: result.input.height,
                        heightMeters: result.input.heightMeters
                      }}
                      additionalInfo={{
                        calculationDate: new Date().toLocaleDateString(),
                        formulaUsed: result.formula.name
                      }}
                      variant="outline"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
              
            {/* Medical Disclaimer */}
            <Card className="mt-6 bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="text-sm text-yellow-800">
                  <strong>Medical Disclaimer:</strong> BMI is a screening tool, not a diagnostic tool. 
                  Individual body composition varies significantly. This calculator is for educational 
                  purposes only and should not replace professional medical advice. Consult with 
                  healthcare providers for personalized health assessments.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 MediCal. For educational purposes only.</p>
        </div>
      </footer>
    </>
  );
}