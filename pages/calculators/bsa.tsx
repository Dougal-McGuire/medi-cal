import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { BSAFormSchema, type BSAFormData } from '@/lib/schemas';
import { STRINGS } from '@/resources/strings';
import type { BSAFormula, BSAResult } from '@/types/calculator';
import PrintButton from '../../commons/components/PrintButton';

const BSA_FORMULAS: BSAFormula[] = [
  { key: 'dubois', name: 'Du Bois Formula (1916)', description: 'Most widely used BSA formula, standard medical reference' },
  { key: 'mosteller', name: 'Mosteller Formula (1987)', description: 'Simplified formula that is easy to calculate mentally' },
  { key: 'haycock', name: 'Haycock Formula (1978)', description: 'Formula developed specifically for pediatric populations' },
  { key: 'boyd', name: 'Boyd Formula (1935)', description: 'Complex formula with logarithmic weight scaling' },
  { key: 'gehan', name: 'Gehan-George Formula (1970)', description: 'Alternative formula with different scaling exponents' }
];

export default function BSACalculator() {
  const [result, setResult] = useState<BSAResult | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<BSAFormData>({
    resolver: zodResolver(BSAFormSchema),
    defaultValues: {
      weight: '',
      height: '',
      formula: 'dubois'
    }
  });

  const formula = watch('formula');
  const selectedFormula = BSA_FORMULAS.find(f => f.key === formula);

  const onSubmit = async (data: BSAFormData) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/calculators/bsa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          weight: parseFloat(data.weight),
          height: parseFloat(data.height),
          formula: data.formula
        })
      });

      const responseData = await response.json();
      
      if (response.ok) {
        setResult(responseData);
      } else {
        console.error('Error:', responseData.error);
      }
    } catch (error) {
      console.error('Error calculating BSA:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{`BSA Calculator - ${STRINGS.APP_NAME}`}</title>
        <meta name="description" content="Professional BSA calculator with multiple medical formulas for body surface area calculation" />
        <meta name="viewport" content={STRINGS.VIEWPORT_META} />
      </Head>

      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              {STRINGS.APP_NAME}
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                {STRINGS.NAV_HOME}
              </Link>
              <Link href="/calculators/bmi" className="text-muted-foreground hover:text-foreground transition-colors">
                {STRINGS.NAV_BMI_CALCULATOR}
              </Link>
              <Link href="/calculators/bsa" className="text-foreground">
                BSA Calculator
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Body Surface Area Calculator</h1>
              <p className="text-muted-foreground">
                Calculate Body Surface Area using validated medical formulas for clinical applications
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Enter Your Information</CardTitle>
                <CardDescription>
                  Enter your weight and height to calculate your BSA using the selected formula.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        min="1.0"
                        max="1000.0"
                        placeholder="70.0"
                        {...register('weight')}
                        className={errors.weight ? "border-destructive" : ""}
                      />
                      {errors.weight && (
                        <p className="text-sm text-destructive">{errors.weight.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        min="50"
                        max="300"
                        placeholder="175.0"
                        {...register('height')}
                        className={errors.height ? "border-destructive" : ""}
                      />
                      {errors.height && (
                        <p className="text-sm text-destructive">{errors.height.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="formula">BSA Formula</Label>
                    <Select value={formula} onValueChange={(value) => setValue('formula', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a formula" />
                      </SelectTrigger>
                      <SelectContent>
                        {BSA_FORMULAS.map((f) => (
                          <SelectItem key={f.key} value={f.key}>
                            {f.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedFormula && (
                      <p className="text-sm text-muted-foreground">
                        {selectedFormula.description}
                      </p>
                    )}
                    {errors.formula && (
                      <p className="text-sm text-destructive">{errors.formula.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Calculating...' : 'Calculate BSA'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>Your BSA Results</CardTitle>
                  <CardDescription>
                    Results calculated using {result.formula.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-primary">
                      {result.bsa} <span className="text-lg text-muted-foreground">m²</span>
                    </div>
                    <div className="text-lg text-muted-foreground">
                      Body Surface Area
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Formula Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="font-medium">{result.formula.name}</div>
                        <p className="text-sm text-muted-foreground">
                          {result.formula.description}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Normal Ranges</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Adult Male:</span>
                            <span>{result.interpretation.normalRanges.adult_male}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Adult Female:</span>
                            <span>{result.interpretation.normalRanges.adult_female}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Child:</span>
                            <span>{result.interpretation.normalRanges.child}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Clinical Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        {result.interpretation.applications.map((application, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>{application}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <div className="text-center border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Input: {result.input.weight} kg, {result.input.height} cm ({result.input.heightMeters} m)
                    </p>
                    
                    <PrintButton
                      calculatorName="BSA Calculator"
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
           
          </div>
        </div>
      </main>

      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>{STRINGS.FOOTER_COPYRIGHT}</p>
        </div>
      </footer>
    </>
  );
}