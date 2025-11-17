import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaUploader } from '@/components/MediaUploader';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePatient } from '@/contexts/PatientContext';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Patient } from '@shared/schema';

const steps = ['Basic Info', 'Photo', 'Complete'];

export default function PatientSetup() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { setCurrentPatient } = usePatient();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dementiaStage: '',
    relationship: '',
    photoFiles: [] as File[],
  });

  const createPatientMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest<Patient>('POST', '/api/patients', data);
    },
    onSuccess: (patient) => {
      setCurrentPatient(patient);
      toast({
        title: 'Patient profile created!',
        description: `${patient.name}'s profile has been set up successfully.`,
      });
      setLocation('/home');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create patient profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.name || !formData.age || !formData.dementiaStage || !formData.relationship) {
        toast({
          title: 'Missing information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!user) return;
    
    createPatientMutation.mutate({
      userId: user.id,
      name: formData.name,
      age: parseInt(formData.age),
      dementiaStage: formData.dementiaStage,
      relationship: formData.relationship,
      photoUrl: null,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="max-w-2xl mx-auto w-full px-6 py-8 space-y-8 flex-1">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentStep(currentStep - 1)}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-foreground">Patient Profile Setup</h1>
              <p className="text-muted-foreground mt-1">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="p-8 rounded-2xl">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Basic Information</h2>
                <p className="text-muted-foreground">Tell us about the person you're caring for</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter name"
                    className="h-12 rounded-xl"
                    data-testid="input-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Enter age"
                    className="h-12 rounded-xl"
                    data-testid="input-age"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dementia-stage">Dementia Stage *</Label>
                  <Select
                    value={formData.dementiaStage}
                    onValueChange={(value) => setFormData({ ...formData, dementiaStage: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl" data-testid="select-dementia-stage">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early">Early Stage</SelectItem>
                      <SelectItem value="middle">Middle Stage</SelectItem>
                      <SelectItem value="late">Late Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship">Your Relationship *</Label>
                  <Select
                    value={formData.relationship}
                    onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl" data-testid="select-relationship">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="caregiver">Professional Caregiver</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Add a Photo</h2>
                <p className="text-muted-foreground">Upload a recent photo (optional)</p>
              </div>

              <MediaUploader
                onUpload={(files) => setFormData({ ...formData, photoFiles: files })}
                accept="image/*"
                maxFiles={1}
                label="Upload Photo"
              />

              <p className="text-sm text-muted-foreground text-center">
                You can skip this step and add a photo later
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center">
                <div className="rounded-full bg-primary/20 p-6">
                  <Check className="h-12 w-12 text-primary" />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">All Set!</h2>
                <p className="text-muted-foreground">
                  {formData.name}'s profile is ready. You can now start building memories and creating sessions.
                </p>
              </div>
            </div>
          )}
        </Card>

        <div className="flex gap-4">
          {currentStep > 0 && currentStep < steps.length - 1 && (
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl"
              onClick={() => setCurrentStep(currentStep + 1)}
              data-testid="button-skip"
            >
              Skip
            </Button>
          )}
          <Button
            className="flex-1 h-12 rounded-xl"
            onClick={handleNext}
            disabled={createPatientMutation.isPending}
            data-testid="button-next"
          >
            {createPatientMutation.isPending ? (
              'Creating...'
            ) : currentStep === steps.length - 1 ? (
              'Get Started'
            ) : (
              <>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
