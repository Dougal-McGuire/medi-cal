import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function BMICalculator() {
  const [unit, setUnit] = useState('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateBMI = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/calculators/bmi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          weight: parseFloat(weight),
          height: parseFloat(height),
          unit
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        alert('Error: ' + data.error);
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
                  <label htmlFor="unit">Unit System</label>
                  <select
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <option value="metric">Metric (kg, m)</option>
                    <option value="imperial">Imperial (lbs, in)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="weight">
                    Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                  </label>
                  <input
                    type="number"
                    id="weight"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="height">
                    Height ({unit === 'metric' ? 'm' : 'in'})
                  </label>
                  <input
                    type="number"
                    id="height"
                    step="0.01"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                  />
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
                  <div className="result-value">BMI: {result.bmi}</div>
                  <div 
                    className="result-category"
                    style={{ color: getCategoryColor(result.category) }}
                  >
                    Category: {result.category}
                  </div>
                  <div>
                    Input: {result.input.weight} {result.unit === 'metric' ? 'kg' : 'lbs'}, {result.input.height} {result.unit === 'metric' ? 'm' : 'in'}
                  </div>
                </div>
              )}
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