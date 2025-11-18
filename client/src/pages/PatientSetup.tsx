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

const steps = ['Basic Info', 'Important People', 'Life Events'];

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
  });

  const [people, setPeople] = useState<{
    name: string;
    relation: string;
    profession: string;
    contact: string;
    age: string;
  }[]>([]);

  const [newPerson, setNewPerson] = useState({
    name: '',
    relation: '',
    profession: '',
    contact: '',
    age: '',
  });

  const [lifeEvents, setLifeEvents] = useState({
    early: {
      dob: '',
      schooling: '',
      parentsAndChildhood: '',
    },
    mid: {
      profession: '',
      marriage: '',
      financialStatus: '',
      residence: '',
    },
    present: {
      workStatus: '',
      familyStatus: '',
    },
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

  const handleAddPerson = () => {
    if (!newPerson.name || !newPerson.relation) {
      toast({
        title: 'Missing information',
        description: 'Please at least add name and relation.',
        variant: 'destructive',
      });
      return;
    }

    setPeople([...people, newPerson]);
    setNewPerson({ name: '', relation: '', profession: '', contact: '', age: '' });
  };

  const handleSubmit = () => {
    if (!user) return;
    
    createPatientMutation.mutate({
      userId: user.id,
      name: formData.name,
      age: parseInt(formData.age, 10),
      dementiaStage: formData.dementiaStage,
      relationship: formData.relationship,
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
                <h2 className="text-xl font-semibold text-foreground mb-2">Important People & Family</h2>
                <p className="text-muted-foreground">Add key people in your loved one's life</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="person-name">Name *</Label>
                    <Input
                      id="person-name"
                      value={newPerson.name}
                      onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                      placeholder="Enter name"
                      className="h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="person-relation">Relation *</Label>
                    <Input
                      id="person-relation"
                      value={newPerson.relation}
                      onChange={(e) => setNewPerson({ ...newPerson, relation: e.target.value })}
                      placeholder="e.g. Son, Daughter, Friend"
                      className="h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="person-profession">Profession</Label>
                    <Input
                      id="person-profession"
                      value={newPerson.profession}
                      onChange={(e) => setNewPerson({ ...newPerson, profession: e.target.value })}
                      placeholder="e.g. Teacher"
                      className="h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="person-contact">Contact</Label>
                    <Input
                      id="person-contact"
                      value={newPerson.contact}
                      onChange={(e) => setNewPerson({ ...newPerson, contact: e.target.value })}
                      placeholder="Phone or email"
                      className="h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="person-age">Age</Label>
                    <Input
                      id="person-age"
                      value={newPerson.age}
                      onChange={(e) => setNewPerson({ ...newPerson, age: e.target.value })}
                      placeholder="Age"
                      className="h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" variant="outline" className="rounded-xl" onClick={handleAddPerson}>
                    Add Person
                  </Button>
                </div>

                {people.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">Added people</h3>
                    <div className="space-y-2">
                      {people.map((person, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 rounded-xl bg-muted"
                        >
                          <div className="space-y-1 text-sm">
                            <p className="font-medium">{person.name} – {person.relation}</p>
                            <p className="text-muted-foreground">
                              {person.profession && `${person.profession} · `}
                              {person.age && `${person.age} yrs`}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">{person.contact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Significant Life Events</h2>
                <p className="text-muted-foreground">
                  Capture key moments across early life, mid life, and present life.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Early life</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of birth</Label>
                      <Input
                        id="dob"
                        value={lifeEvents.early.dob}
                        onChange={(e) =>
                          setLifeEvents({
                            ...lifeEvents,
                            early: { ...lifeEvents.early, dob: e.target.value },
                          })
                        }
                        placeholder="DD/MM/YYYY"
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schooling">Schooling / College</Label>
                      <Input
                        id="schooling"
                        value={lifeEvents.early.schooling}
                        onChange={(e) =>
                          setLifeEvents({
                            ...lifeEvents,
                            early: { ...lifeEvents.early, schooling: e.target.value },
                          })
                        }
                        placeholder="Schools, colleges"
                        className="h-10 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parents-childhood">Parents & childhood</Label>
                    <Input
                      id="parents-childhood"
                      value={lifeEvents.early.parentsAndChildhood}
                      onChange={(e) =>
                        setLifeEvents({
                          ...lifeEvents,
                          early: { ...lifeEvents.early, parentsAndChildhood: e.target.value },
                        })
                      }
                      placeholder="Important details about parents and childhood"
                      className="h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Mid life</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession / Job</Label>
                      <Input
                        id="profession"
                        value={lifeEvents.mid.profession}
                        onChange={(e) =>
                          setLifeEvents({
                            ...lifeEvents,
                            mid: { ...lifeEvents.mid, profession: e.target.value },
                          })
                        }
                        placeholder="Main occupation"
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="marriage">Marriage</Label>
                      <Input
                        id="marriage"
                        value={lifeEvents.mid.marriage}
                        onChange={(e) =>
                          setLifeEvents({
                            ...lifeEvents,
                            mid: { ...lifeEvents.mid, marriage: e.target.value },
                          })
                        }
                        placeholder="Spouse, year, key details"
                        className="h-10 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="financial-status">Financial status</Label>
                      <Input
                        id="financial-status"
                        value={lifeEvents.mid.financialStatus}
                        onChange={(e) =>
                          setLifeEvents({
                            ...lifeEvents,
                            mid: { ...lifeEvents.mid, financialStatus: e.target.value },
                          })
                        }
                        placeholder="Overall financial situation"
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="residence">Place of residence</Label>
                      <Input
                        id="residence"
                        value={lifeEvents.mid.residence}
                        onChange={(e) =>
                          setLifeEvents({
                            ...lifeEvents,
                            mid: { ...lifeEvents.mid, residence: e.target.value },
                          })
                        }
                        placeholder="Cities, homes, important moves"
                        className="h-10 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Present life</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="work-status">Retired or working</Label>
                      <Input
                        id="work-status"
                        value={lifeEvents.present.workStatus}
                        onChange={(e) =>
                          setLifeEvents({
                            ...lifeEvents,
                            present: { ...lifeEvents.present, workStatus: e.target.value },
                          })
                        }
                        placeholder="Current work status"
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="family-status">Family status</Label>
                      <Input
                        id="family-status"
                        value={lifeEvents.present.familyStatus}
                        onChange={(e) =>
                          setLifeEvents({
                            ...lifeEvents,
                            present: { ...lifeEvents.present, familyStatus: e.target.value },
                          })
                        }
                        placeholder="Who they live with, family situation"
                        className="h-10 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
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
