import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient } from '@shared/schema';

interface PatientContextType {
  currentPatient: Patient | null;
  setCurrentPatient: (patient: Patient | null) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [currentPatient, setCurrentPatientState] = useState<Patient | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('currentPatient');
    if (stored) {
      setCurrentPatientState(JSON.parse(stored));
    }
  }, []);

  const setCurrentPatient = (patient: Patient | null) => {
    setCurrentPatientState(patient);
    if (patient) {
      localStorage.setItem('currentPatient', JSON.stringify(patient));
    } else {
      localStorage.removeItem('currentPatient');
    }
  };

  return (
    <PatientContext.Provider value={{ currentPatient, setCurrentPatient }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
}
