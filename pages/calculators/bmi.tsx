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
import { BMIFormSchema, type BMIFormData } from '@/lib/schemas';
import { STRINGS } from '@/resources/strings';
import type { BMIFormula, BMIResult } from '@/types/calculator';
import PrintButton from '../../commons/components/PrintButton';

const BMI_FORMULAS: BMIFormula[] = [
  { key: 'traditional', name: 'Traditional Quetelet Index', description: 'Standard BMI calculation (weight/height²)' },
  { key: 'trefethen', name: "Trefethen's New BMI", description: 'Modified BMI that reduces height bias' },
  { key: 'prime', name: 'BMI Prime', description: 'Ratio-based BMI (Traditional BMI ÷ 25)' },
  { key: 'reciprocal', name: 'Reciprocal BMI', description: 'Height-cubed scaling (better for tall/short people)' },
  { key: 'geometric', name: 'Geometric Mean BMI', description: 'Compromise scaling formula' }
];

export default function BMICalculator() {
  const [result, setResult] = useState<BMIResult | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<BMIFormData>({
    resolver: zodResolver(BMIFormSchema),
    defaultValues: {
      weight: '',
      height: '',
      formula: 'traditional'
    }
  });

  const formula = watch('formula');
  const selectedFormula = BMI_FORMULAS.find(f => f.key === formula);

  const onSubmit = async (data: BMIFormData) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/calculators/bmi', {
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
      console.error('Error calculating BMI:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Underweight': 'text-cyan-600',
      'Normal weight': 'text-green-600', 
      'Overweight': 'text-yellow-600',
      'Obese': 'text-red-600'
    };
    return colors[category] || 'text-foreground';
  };

  return (
    <>
      <Head>
        <title>{`BMI Calculator - ${STRINGS.APP_NAME}`}</title>
        <meta name="description" content="Professional BMI calculator with multiple formulas" />
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
              <Link href="/calculators/bmi" className="text-foreground">
                {STRINGS.NAV_BMI_CALCULATOR}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">{STRINGS.BMI_CALCULATOR_TITLE}</h1>
              <p className="text-muted-foreground">
                Calculate Body Mass Index using multiple validated formulas
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Enter Your Information</CardTitle>
                <CardDescription>
                  Enter your weight and height to calculate your BMI using the selected formula.
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
                    <Label htmlFor="formula">BMI Formula</Label>
                    <Select value={formula} onValueChange={(value) => setValue('formula', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a formula" />
                      </SelectTrigger>
                      <SelectContent>
                        {BMI_FORMULAS.map((f) => (
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
                    {loading ? 'Calculating...' : 'Calculate BMI'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>Your BMI Results</CardTitle>
                  <CardDescription>
                    Results calculated using {result.formula.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-primary">
                      {result.formula.name === 'BMI Prime' ? `BMI Prime: ${result.bmi}` : 
                       result.formula.name === 'Reciprocal BMI (Ponderal Index)' ? `Ponderal Index: ${result.bmi}` :
                       `BMI: ${result.bmi}`}
                      {result.formula.name !== 'BMI Prime' && result.formula.name !== 'Reciprocal BMI (Ponderal Index)' && (
                        <span className="text-lg text-muted-foreground"> kg/m²</span>
                      )}
                    </div>
                    <div className={cn("text-2xl font-semibold", getCategoryColor(result.category))}>
                      {result.category}
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
                        <CardTitle className="text-lg">Category Ranges</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-cyan-600">Underweight:</span>
                            <span>{result.interpretation.ranges.underweight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-600">Normal:</span>
                            <span>{result.interpretation.ranges.normal}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-yellow-600">Overweight:</span>
                            <span>{result.interpretation.ranges.overweight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-600">Obese:</span>
                            <span>{result.interpretation.ranges.obese}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="text-center border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Input: {result.input.weight} kg, {result.input.height} cm ({result.input.heightMeters} m)
                    </p>
                    
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