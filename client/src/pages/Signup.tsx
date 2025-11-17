import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { User } from '@shared/schema';

export default function Signup() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signupMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      return await apiRequest<User>('POST', '/api/auth/signup', data);
    },
    onSuccess: (user) => {
      login(user);
      toast({
        title: 'Account created!',
        description: 'Welcome to Memory Reconstruction Assistant.',
      });
      setLocation('/patient-setup');
    },
    onError: () => {
      toast({
        title: 'Signup failed',
        description: 'This email may already be in use.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }
    signupMutation.mutate({ name, email, password });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 px-6">
      <div className="py-6">
        <Link href="/welcome">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-primary/20 p-6">
                <Heart className="h-12 w-12 text-primary fill-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Create Account</h1>
              <p className="text-muted-foreground mt-2">
                Begin your caregiving journey with us
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-12 rounded-xl"
                data-testid="input-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-12 rounded-xl"
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="h-12 rounded-xl"
                data-testid="input-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base rounded-xl"
              disabled={signupMutation.isPending}
              data-testid="button-submit"
            >
              {signupMutation.isPending ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login">
                <span className="text-primary font-medium hover:underline cursor-pointer">
                  Sign in
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
