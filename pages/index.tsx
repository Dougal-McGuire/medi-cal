import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { STRINGS } from '@/resources/strings';

export default function Home() {
  return (
    <>
      <Head>
        <title>{`${STRINGS.APP_NAME} - ${STRINGS.HOME_TITLE}`}</title>
        <meta name="description" content={STRINGS.HOME_META_DESCRIPTION} />
        <meta name="viewport" content={STRINGS.VIEWPORT_META} />
      </Head>

      <header className="bg-background border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-foreground">{STRINGS.APP_NAME}</h1>
            <nav className="flex space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">{STRINGS.NAV_HOME}</Link>
              <Link href="/calculators/bmi" className="text-foreground hover:text-primary transition-colors">{STRINGS.NAV_BMI_CALCULATOR}</Link>
              <Link href="/calculators/bsa" className="text-foreground hover:text-primary transition-colors">BSA Calculator</Link>
              <Link href="/calculators/creatinine" className="text-foreground hover:text-primary transition-colors">Creatinine Calculator</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-background">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">{STRINGS.HOME_TITLE}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{STRINGS.HOME_SUBTITLE}</p>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold mb-12 text-foreground">{STRINGS.AVAILABLE_CALCULATORS}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-primary">{STRINGS.BMI_CALCULATOR_TITLE}</CardTitle>
                  <CardDescription>
                    {STRINGS.BMI_CALCULATOR_DESCRIPTION}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/calculators/bmi">
                    <Button className="w-full">{STRINGS.BMI_CALCULATOR_BUTTON}</Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-primary">{STRINGS.BSA_CALCULATOR_TITLE}</CardTitle>
                  <CardDescription>
                    {STRINGS.BSA_CALCULATOR_DESCRIPTION}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/calculators/bsa">
                    <Button className="w-full">Calculate BSA</Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-primary">{STRINGS.CREATININE_CALCULATOR_TITLE}</CardTitle>
                  <CardDescription>
                    {STRINGS.CREATININE_CALCULATOR_DESCRIPTION}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/calculators/creatinine">
                    <Button className="w-full">Calculate eGFR</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t border-border py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">{STRINGS.FOOTER_COPYRIGHT}</p>
        </div>
      </footer>
    </>
  );
}