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

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return await apiRequest<User>('POST', '/api/auth/login', data);
    },
    onSuccess: (user) => {
      login(user);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      setLocation('/home');
    },
    onError: () => {
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }
    loginMutation.mutate({ email, password });
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
              <h1 className="text-2xl font-semibold text-foreground">Welcome Back</h1>
              <p className="text-muted-foreground mt-2">
                Sign in to continue your journey
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your password"
                className="h-12 rounded-xl"
                data-testid="input-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base rounded-xl"
              disabled={loginMutation.isPending}
              data-testid="button-submit"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup">
                <span className="text-primary font-medium hover:underline cursor-pointer">
                  Sign up
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
