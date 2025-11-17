import { createContext, useContext, useState, ReactNode } from 'react';
import { Session } from '@shared/schema';

interface SessionContextType {
  currentSession: Session | null;
  setCurrentSession: (session: Session | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <SessionContext.Provider
      value={{
        currentSession,
        setCurrentSession,
        isPlaying,
        setIsPlaying,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
