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
import { cn, creatinineConversion } from '@/lib/utils';
import { CreatinineFormSchema, type CreatinineFormData } from '@/lib/schemas';
import { STRINGS } from '@/resources/strings';
import type { CreatinineFormula, CreatinineResult } from '@/types/calculator';
import PrintButton from '../../commons/components/PrintButton';

const CREATININE_FORMULAS: CreatinineFormula[] = [
  { key: 'ckd_epi_2021', name: 'CKD-EPI 2021 (Recommended)', description: 'Latest formula without race factor (NKF/ASN 2021)' },
  { key: 'ckd_epi_2009', name: 'CKD-EPI 2009', description: 'Previous version with race factor (historical)' },
  { key: 'mdrd', name: 'MDRD', description: 'Modification of Diet in Renal Disease equation (historical)' },
  { key: 'cockcroft_gault', name: 'Cockcroft-Gault', description: 'Creatinine clearance for drug dosing (not normalized to BSA)' }
];

export default function CreatinineCalculator() {
  const [result, setResult] = useState<CreatinineResult | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreatinineFormData>({
    resolver: zodResolver(CreatinineFormSchema),
    defaultValues: {
      age: '',
      weight: '',
      creatinine: '',
      creatinineUnit: 'mg_dl',
      sex: '',
      race: '',
      formula: 'ckd_epi_2021'
    }
  });

  const formula = watch('formula');
  const creatinineUnit = watch('creatinineUnit');
  const selectedFormula = CREATININE_FORMULAS.find(f => f.key === formula);

  const onSubmit = async (data: CreatinineFormData) => {
    setLoading(true);
    
    try {
      const requestBody: any = {
        age: parseInt(data.age),
        weight: parseFloat(data.weight),
        creatinine: parseFloat(data.creatinine),
        creatinineUnit: data.creatinineUnit,
        sex: data.sex,
        formula: data.formula
      };

      // Only include race if it's provided and not empty
      if (data.race && data.race !== '') {
        requestBody.race = data.race;
      }

      const response = await fetch('/api/calculators/creatinine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();
      
      if (response.ok) {
        setResult(responseData);
      } else {
        console.error('Error:', responseData.error);
      }
    } catch (error) {
      console.error('Error calculating eGFR:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCKDStageColor = (stage: string): string => {
    const stageNum = parseInt(stage, 10);
    if (stage.startsWith('3')) return 'text-yellow-600';

    const colors: Record<number, string> = {
      1: 'text-green-600',
      2: 'text-green-600',
      4: 'text-orange-600',
      5: 'text-red-600'
    };
    return colors[stageNum] || 'text-foreground';
  };

  return (
    <>
      <Head>
        <title>{`Creatinine Clearance Calculator - ${STRINGS.APP_NAME}`}</title>
        <meta name="description" content="Professional eGFR calculator with CKD-EPI, MDRD, and Cockcroft-Gault formulas for kidney function assessment" />
        <meta name="viewport" content={STRINGS.VIEWPORT_META} />
      </Head>


      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Creatinine Clearance Calculator</h1>
              <p className="text-muted-foreground">
                Calculate estimated glomerular filtration rate (eGFR) for kidney function assessment and CKD staging
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>
                  Enter patient details to calculate eGFR using the selected formula.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age (years)</Label>
                      <Input
                        id="age"
                        type="number"
                        step="1"
                        min="18"
                        max="120"
                        placeholder="65"
                        {...register('age')}
                        className={errors.age ? "border-destructive" : ""}
                      />
                      {errors.age && (
                        <p className="text-sm text-destructive">{errors.age.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        min="30"
                        max="300"
                        placeholder="70.0"
                        {...register('weight')}
                        className={errors.weight ? "border-destructive" : ""}
                      />
                      {errors.weight && (
                        <p className="text-sm text-destructive">{errors.weight.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="creatinineUnit">Creatinine Unit</Label>
                      <Select value={creatinineUnit} onValueChange={(value) => setValue('creatinineUnit', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mg_dl">mg/dL (US)</SelectItem>
                          <SelectItem value="mmol_l">μmol/L (International)</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.creatinineUnit && (
                        <p className="text-sm text-destructive">{errors.creatinineUnit.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="creatinine">
                        Serum Creatinine ({creatinineConversion.getUnitLabel(creatinineUnit as 'mg_dl' | 'mmol_l')})
                      </Label>
                      <Input
                        id="creatinine"
                        type="number"
                        step={creatinineUnit === 'mg_dl' ? '0.01' : '1'}
                        min={creatinineConversion.getValidationRange(creatinineUnit as 'mg_dl' | 'mmol_l').min}
                        max={creatinineConversion.getValidationRange(creatinineUnit as 'mg_dl' | 'mmol_l').max}
                        placeholder={creatinineUnit === 'mg_dl' ? '1.0' : '88'}
                        {...register('creatinine')}
                        className={errors.creatinine ? "border-destructive" : ""}
                      />
                      {errors.creatinine && (
                        <p className="text-sm text-destructive">{errors.creatinine.message}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Range: {creatinineConversion.getValidationRange(creatinineUnit as 'mg_dl' | 'mmol_l').min}-{creatinineConversion.getValidationRange(creatinineUnit as 'mg_dl' | 'mmol_l').max} {creatinineConversion.getValidationRange(creatinineUnit as 'mg_dl' | 'mmol_l').unit}
                        <br />
                        Must be standardized IDMS-traceable value
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sex">Sex</Label>
                    <Select value={watch('sex')} onValueChange={(value) => setValue('sex', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sex && (
                      <p className="text-sm text-destructive">{errors.sex.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="race">Race (for historical formulas)</Label>
                    <Select value={watch('race') || undefined} onValueChange={(value) => setValue('race', value || '')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select race (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="black">Black/African American</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.race && (
                      <p className="text-sm text-destructive">{errors.race.message}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Not used in CKD-EPI 2021 (recommended formula). Leave unselected if not applicable.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="formula">eGFR Formula</Label>
                    <Select value={formula} onValueChange={(value) => setValue('formula', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a formula" />
                      </SelectTrigger>
                      <SelectContent>
                        {CREATININE_FORMULAS.map((f) => (
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
                    {loading ? 'Calculating...' : 'Calculate eGFR'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>eGFR Results</CardTitle>
                  <CardDescription>
                    Results calculated using {result.formula.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-primary">
                      {result.egfr} <span className="text-lg text-muted-foreground">{result.units}</span>
                    </div>
                    <div className={cn("text-2xl font-semibold", getCKDStageColor(result.interpretation.ckdStage.stage))}>
                      {result.interpretation.ckdStage.description}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      GFR Range: {result.interpretation.ckdStage.gfrRange}
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
                        <CardTitle className="text-lg">Patient Data</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Age:</span>
                            <span>{result.input.age} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Weight:</span>
                            <span>{result.input.weight} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Creatinine:</span>
                            <span>
                              {result.input.creatinine} {creatinineConversion.getUnitLabel(result.input.creatinineUnit)}
                              {result.input.creatinineMgDl && result.input.creatinineUnit === 'mmol_l' && (
                                <span className="text-muted-foreground text-xs block">
                                  ({result.input.creatinineMgDl} mg/dL)
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sex:</span>
                            <span className="capitalize">{result.input.sex}</span>
                          </div>
                          {result.input.race && (
                            <div className="flex justify-between">
                              <span>Race:</span>
                              <span className="capitalize">{result.input.race}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Clinical Context & Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-2">
                        {result.interpretation.clinicalContext.map((context, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>{context}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <div className="text-center border-t pt-4">
                    <PrintButton
                      calculatorName="Creatinine Clearance Calculator"
                      result={result}
                      inputs={{
                        age: result.input.age,
                        weight: result.input.weight,
                        creatinine: result.input.creatinine,
                        sex: result.input.sex,
                        race: result.input.race
                      }}
                      additionalInfo={{
                        calculationDate: new Date().toLocaleDateString(),
                        formulaUsed: result.formula.name,
                        ckdStage: result.interpretation.ckdStage.description
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