import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>MediCal - Medical Calculator Tools</title>
        <meta name="description" content="Professional medical calculators with modern interface" />
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
        <section className="hero">
          <div className="container">
            <h1 className="hero-title">Medical Calculator Tools</h1>
            <p className="hero-subtitle">Professional medical calculators with modern interface</p>
          </div>
        </section>

        <section className="calculators">
          <div className="container">
            <h2 className="section-title">Available Calculators</h2>
            <div className="calculator-grid">
              <div className="calculator-card">
                <h3>BMI Calculator</h3>
                <p>Calculate Body Mass Index with metric or imperial units</p>
                <Link href="/calculators/bmi" className="btn">Calculate BMI</Link>
              </div>
              <div className="calculator-card">
                <h3>BSA Calculator</h3>
                <p>Body Surface Area calculation (Coming Soon)</p>
                <button className="btn btn-disabled" disabled>Coming Soon</button>
              </div>
              <div className="calculator-card">
                <h3>Creatinine Clearance</h3>
                <p>Kidney function assessment (Coming Soon)</p>
                <button className="btn btn-disabled" disabled>Coming Soon</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 MediCal. For educational purposes only.</p>
        </div>
      </footer>
    </>
  );
}