import { Link } from 'wouter';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 px-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full space-y-8">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-primary/20 p-8">
              <Heart className="h-16 w-16 text-primary fill-primary" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Memory Reconstruction
            </h1>
            <p className="text-lg font-light italic text-muted-foreground">
              Rebuilding memories. Restoring calm.
            </p>
          </div>

          <div className="pt-4">
            <div className="flex items-center gap-2 text-accent-foreground bg-accent/50 px-4 py-3 rounded-xl">
              <Sparkles className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm text-left">
                A compassionate companion for dementia caregivers. Create personalized memory sessions that bring comfort and connection.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4">
          <Link href="/signup">
            <Button
              className="w-full h-14 text-base rounded-xl"
              size="lg"
              data-testid="button-get-started"
            >
              Get Started
            </Button>
          </Link>

          <Link href="/login">
            <Button
              variant="outline"
              className="w-full h-14 text-base rounded-xl"
              size="lg"
              data-testid="button-login"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>

      <div className="text-center py-8 text-sm text-muted-foreground">
        With care, for those who care
      </div>
    </div>
  );
}
