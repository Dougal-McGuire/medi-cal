import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PrintButton from '../../commons/components/PrintButton';

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
        <div className="container">
          <section style={{ padding: '3rem 0' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>BMI Calculator</h1>
            
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <form onSubmit={calculateBMI}>
                <div className="form-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
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
                    <div style={{ color: 'var(--danger-color)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.weight}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="height">Height (cm)</label>
                  <input
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
                    <div style={{ color: 'var(--danger-color)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.height}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="formula">BMI Formula</label>
                  <select
                    id="formula"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                  >
                    {BMI_FORMULAS.map((f) => (
                      <option key={f.key} value={f.key}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                    {BMI_FORMULAS.find(f => f.key === formula)?.description}
                  </div>
                  {errors.formula && (
                    <div style={{ color: 'var(--danger-color)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.formula}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn" 
                  style={{ width: '100%' }}
                  disabled={loading}
                >
                  {loading ? 'Calculating...' : 'Calculate BMI'}
                </button>
              </form>

              {result && (
                <div className="result-card">
                  <div className="result-value">
                    {result.formula.name === 'BMI Prime' ? `BMI Prime: ${result.bmi}` : 
                     result.formula.name === 'Reciprocal BMI (Ponderal Index)' ? `Ponderal Index: ${result.bmi}` :
                     `BMI: ${result.bmi}`}
                    {result.formula.name !== 'BMI Prime' && result.formula.name !== 'Reciprocal BMI (Ponderal Index)' && (
                      <span style={{ fontSize: '0.6em', color: '#666' }}> kg/m²</span>
                    )}
                  </div>
                  <div 
                    className="result-category"
                    style={{ color: getCategoryColor(result.category) }}
                  >
                    Category: {result.category}
                  </div>
                  
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      Formula: {result.formula.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
                      {result.formula.description}
                    </div>
                    
                    <div style={{ fontSize: '0.875rem' }}>
                      <strong>Category Ranges for {result.formula.name}:</strong>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <div><span style={{ color: '#17a2b8' }}>Underweight:</span> {result.interpretation.ranges.underweight}</div>
                        <div><span style={{ color: '#28a745' }}>Normal:</span> {result.interpretation.ranges.normal}</div>
                        <div><span style={{ color: '#ffc107' }}>Overweight:</span> {result.interpretation.ranges.overweight}</div>
                        <div><span style={{ color: '#dc3545' }}>Obese:</span> {result.interpretation.ranges.obese}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '1rem' }}>
                    Input: {result.input.weight} kg, {result.input.height} cm ({result.input.heightMeters} m)
                  </div>
                  
                  <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
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
                </div>
              )}
              
              {/* Medical Disclaimer */}
              <div style={{ 
                marginTop: '2rem', 
                padding: '1rem', 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7', 
                borderRadius: '4px',
                fontSize: '0.875rem' 
              }}>
                <strong>Medical Disclaimer:</strong> BMI is a screening tool, not a diagnostic tool. 
                Individual body composition varies significantly. This calculator is for educational 
                purposes only and should not replace professional medical advice. Consult with 
                healthcare providers for personalized health assessments.
              </div>
            </div>
          </section>
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