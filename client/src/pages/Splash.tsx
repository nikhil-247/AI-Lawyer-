import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Heart } from 'lucide-react';

export default function Splash() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation('/welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 px-6">
      <div className="text-center space-y-6 animate-in fade-in duration-700">
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-primary/20 p-8">
            <Heart className="h-16 w-16 text-primary fill-primary" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Memory Reconstruction
          </h1>
          <p className="text-xl font-light italic text-muted-foreground">
            Rebuilding memories. Restoring calm.
          </p>
        </div>
      </div>
    </div>
  );
}
