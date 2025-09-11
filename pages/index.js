import Head from 'next/head';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

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
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-center text-2xl font-bold mb-12 text-foreground">Available Calculators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-primary">BMI Calculator</CardTitle>
                  <CardDescription>
                    Calculate Body Mass Index with multiple formulas and metric units
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/calculators/bmi">
                    <Button className="w-full">Calculate BMI</Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow opacity-75">
                <CardHeader>
                  <CardTitle className="text-muted-foreground">BSA Calculator</CardTitle>
                  <CardDescription>
                    Body Surface Area calculation (Coming Soon)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" disabled className="w-full">Coming Soon</Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow opacity-75">
                <CardHeader>
                  <CardTitle className="text-muted-foreground">Creatinine Clearance</CardTitle>
                  <CardDescription>
                    Kidney function assessment (Coming Soon)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" disabled className="w-full">Coming Soon</Button>
                </CardContent>
              </Card>
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