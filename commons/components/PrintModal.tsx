import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: (patientId: string) => void;
  calculatorName: string;
}

export default function PrintModal({ isOpen, onClose, onPrint, calculatorName }: PrintModalProps) {
  const [patientId, setPatientId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPrint(patientId.trim() || '');
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
            Add an optional patient identifier to include in the printed report for reference purposes.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patient-id">
                Patient Identifier (Optional)
              </Label>
              <Input
                id="patient-id"
                placeholder="Enter patient ID, name, or reference"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                maxLength={100}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={handleCancel}
            >
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