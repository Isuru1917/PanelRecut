import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DamageRequest, PanelInfo } from '../types/types';
import { useToast } from '@/hooks/use-toast';
import MaterialAutocomplete from './ui/material-autocomplete';
import { PlusCircle, Trash2 } from 'lucide-react';

interface DamageReportFormProps {
  onSubmit: (request: Omit<DamageRequest, 'id' | 'submittedAt' | 'updatedAt'>) => void;
}

const DamageReportForm: React.FC<DamageReportFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    gliderName: '',
    orderNumber: '',
    reason: '',
    requestedBy: '',
    notes: ''
  });

  const [panels, setPanels] = useState<PanelInfo[]>([{
    panelType: 'General', // Default value since we're removing the field but keeping it for data structure
    panelNumber: '',
    material: '',
    quantity: 1,
    side: 'Left Side' as const
  }]);

  type FormErrorType = {
    [K in keyof typeof formData]?: string;
  };

  type PanelErrorType = {
    [index: number]: {
      panelNumber?: string;
      material?: string;
      quantity?: string;
    }
  };

  const [formErrors, setFormErrors] = useState<FormErrorType>({});
  const [panelErrors, setPanelErrors] = useState<PanelErrorType>({});

  const validateForm = () => {
    const newFormErrors: FormErrorType = {};
    const newPanelErrors: PanelErrorType = {};
    let hasErrors = false;

    // Validate main form fields
    if (!formData.gliderName.trim()) {
      newFormErrors.gliderName = 'Glider name is required';
      hasErrors = true;
    }

    if (!formData.orderNumber.trim()) {
      newFormErrors.orderNumber = 'Order number is required';
      hasErrors = true;
    }

    if (!formData.reason.trim()) {
      newFormErrors.reason = 'Reason is required';
      hasErrors = true;
    }

    if (!formData.requestedBy.trim()) {
      newFormErrors.requestedBy = 'Requested by is required';
      hasErrors = true;
    }

    // Validate each panel
    panels.forEach((panel, index) => {
      const panelError: { [key: string]: string } = {};

      if (!panel.panelNumber.trim()) {
        panelError.panelNumber = 'Panel number is required';
        hasErrors = true;
      }

      if (!panel.material.trim()) {
        panelError.material = 'Material is required';
        hasErrors = true;
      }

      if (panel.quantity < 1) {
        panelError.quantity = 'Quantity must be at least 1';
        hasErrors = true;
      }

      if (Object.keys(panelError).length > 0) {
        newPanelErrors[index] = panelError;
      }
    });

    setFormErrors(newFormErrors);
    setPanelErrors(newPanelErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSubmit({
      ...formData,
      panels,
      status: 'Pending'
    });

    // Reset form
    setFormData({
      gliderName: '',
      orderNumber: '',
      reason: '',
      requestedBy: '',
      notes: ''
    });
    
    setPanels([{
      panelType: 'General',
      panelNumber: '',
      material: '',
      quantity: 1,
      side: 'Left Side'
    }]);

    setIsSubmitting(false);

    toast({
      title: "Request Submitted",
      description: "Your damage panel recut request has been submitted successfully.",
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePanelChange = (index: number, field: keyof PanelInfo, value: string | number) => {
    const updatedPanels = [...panels];
    updatedPanels[index] = { ...updatedPanels[index], [field]: value };
    setPanels(updatedPanels);
    
    // Clear error for this field if it exists
    if (panelErrors[index]?.[field]) {
      const updatedErrors = { ...panelErrors };
      if (updatedErrors[index]) {
        updatedErrors[index] = { ...updatedErrors[index], [field]: undefined };
        if (Object.keys(updatedErrors[index]).every(k => !updatedErrors[index][k])) {
          delete updatedErrors[index];
        }
      }
      setPanelErrors(updatedErrors);
    }
  };

  const addPanel = () => {
    setPanels([...panels, {
      panelType: 'General',
      panelNumber: '',
      material: '',
      quantity: 1,
      side: 'Left Side'
    }]);
  };

  const removePanel = (index: number) => {
    if (panels.length === 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one panel is required.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedPanels = [...panels];
    updatedPanels.splice(index, 1);
    setPanels(updatedPanels);
    
    // Remove errors for this panel
    if (panelErrors[index]) {
      const updatedErrors = { ...panelErrors };
      delete updatedErrors[index];
      
      // Reindex errors for panels after the removed one
      Object.keys(updatedErrors).forEach(key => {
        const keyIndex = parseInt(key);
        if (keyIndex > index) {
          updatedErrors[keyIndex - 1] = updatedErrors[keyIndex];
          delete updatedErrors[keyIndex];
        }
      });
      
      setPanelErrors(updatedErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Information */}
      <div className="space-y-4">
        <h3 className="text-md font-medium text-slate-900 border-b border-slate-200 pb-2">
          Order Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gliderName">Glider Name *</Label>
            <Input
              id="gliderName"
              value={formData.gliderName}
              onChange={(e) => handleInputChange('gliderName', e.target.value)}
              className={`transition-all duration-200 ${formErrors.gliderName ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="Enter Glider name"
            />
            {formErrors.gliderName && (
              <p className="text-sm text-red-600">{formErrors.gliderName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderNumber">Order Number *</Label>
            <Input
              id="orderNumber"
              value={formData.orderNumber}
              onChange={(e) => handleInputChange('orderNumber', e.target.value)}
              className={`transition-all duration-200 ${formErrors.orderNumber ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="Enter order number"
            />
            {formErrors.orderNumber && (
              <p className="text-sm text-red-600">{formErrors.orderNumber}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason *</Label>
          <Select 
            value={formData.reason} 
            onValueChange={(value) => handleInputChange('reason', value)}
          >
            <SelectTrigger 
              id="reason"
              className={`transition-all duration-200 ${formErrors.reason ? 'border-red-500 focus:border-red-500' : ''}`}
            >
              <SelectValue placeholder="Select reason for panel recut" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
              <SelectItem value="Incorrect Cutting Tolerance">Incorrect Cutting Tolerance</SelectItem>
              <SelectItem value="Material Damage">Material Damage</SelectItem>
              <SelectItem value="Porosity Test Failure">Porosity Test Failure</SelectItem>
              <SelectItem value="Mismatch in Color">Mismatch in Color</SelectItem>
              <SelectItem value="Pattern Issue">Pattern Issue</SelectItem>
              <SelectItem value="Fabric Deformation or Shrinkage">Fabric Deformation or Shrinkage</SelectItem>
              <SelectItem value="Design Update or Revision">Design Update or Revision</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.reason && (
            <p className="text-sm text-red-600">{formErrors.reason}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="requestedBy">Requested By *</Label>
          <Input
            id="requestedBy"
            value={formData.requestedBy}
            onChange={(e) => handleInputChange('requestedBy', e.target.value)}
            className={`transition-all duration-200 ${formErrors.requestedBy ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder="Enter name of person requesting the recut"
          />
          {formErrors.requestedBy && (
            <p className="text-sm text-red-600">{formErrors.requestedBy}</p>
          )}
        </div>
      </div>

      {/* Panel Information */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <h3 className="text-md font-medium text-slate-900">
            Panel Information
          </h3>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addPanel}
            className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <PlusCircle className="w-4 h-4" /> Add Panel
          </Button>
        </div>
        
        {panels.map((panel, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-3 space-y-3 bg-slate-50">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-slate-800 text-sm">Panel #{index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePanel(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            {/* Panel Number - Full width */}
            <div className="space-y-1">
              <Label htmlFor={`panelNumber-${index}`} className="text-sm">Panel Number *</Label>
              <Textarea
                id={`panelNumber-${index}`}
                value={panel.panelNumber}
                onChange={(e) => handlePanelChange(index, 'panelNumber', e.target.value)}
                className={`min-h-[60px] transition-all duration-200 text-sm ${panelErrors[index]?.panelNumber ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="Enter panel numbers (one per line or separated by commas)..."
              />
              {panelErrors[index]?.panelNumber && (
                <p className="text-xs text-red-600">{panelErrors[index].panelNumber}</p>
              )}
            </div>

            {/* Material - Full width */}
            <div className="space-y-1">
              <MaterialAutocomplete
                id={`material-${index}`}
                value={panel.material}
                onChange={(value) => handlePanelChange(index, 'material', value)}
                required={true}
                error={panelErrors[index]?.material}
              />
            </div>

            {/* Side and Quantity - Same row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={`side-${index}`} className="text-sm">Side *</Label>
                <Select 
                  value={panel.side} 
                  onValueChange={(value: any) => handlePanelChange(index, 'side', value)}
                >
                  <SelectTrigger id={`side-${index}`} className="transition-all duration-200 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                    <SelectItem value="Left Side">Left Side</SelectItem>
                    <SelectItem value="Right Side">Right Side</SelectItem>
                    <SelectItem value="Left & Right Side">Left & Right Side</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor={`quantity-${index}`} className="text-sm">Quantity *</Label>
                <Select 
                  value={panel.quantity.toString()} 
                  onValueChange={(value) => handlePanelChange(index, 'quantity', parseInt(value))}
                >
                  <SelectTrigger 
                    id={`quantity-${index}`}
                    className={`transition-all duration-200 h-9 text-sm ${panelErrors[index]?.quantity ? 'border-red-500 focus:border-red-500' : ''}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 shadow-lg z-50 max-h-48 overflow-y-auto">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {panelErrors[index]?.quantity && (
                  <p className="text-xs text-red-600">{panelErrors[index].quantity}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="min-h-[80px] transition-all duration-200"
            placeholder="Any additional information or special requests..."
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Submitting...</span>
          </div>
        ) : (
          'Submit Panel Recut Request'
        )}
      </Button>
    </form>
  );
};

export default DamageReportForm;
