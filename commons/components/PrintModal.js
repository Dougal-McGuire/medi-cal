import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function PrintModal({ isOpen, onClose, onPrint, calculatorName }) {
  const [patientId, setPatientId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPrint(patientId.trim() || null);
    setPatientId('');
    onClose();
  };

  const handleCancel = () => {
    setPatientId('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Print {calculatorName} Results</DialogTitle>
          <DialogDescription>
            Add an optional patient identifier to include in the printed report.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient-id" className="text-right">
                Patient ID
              </Label>
              <Input
                id="patient-id"
                placeholder="Enter patient ID, name, or reference"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                maxLength={100}
                className="col-span-3"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              This identifier will be included in the printed report for reference purposes.
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Print Results
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}