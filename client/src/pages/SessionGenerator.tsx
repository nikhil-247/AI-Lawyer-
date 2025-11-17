import { useState } from 'react';
import { Brain, Heart, Compass, Play, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BottomNav } from '@/components/BottomNav';
import { Badge } from '@/components/ui/badge';
import { usePatient } from '@/contexts/PatientContext';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { Session } from '@shared/schema';

const sessionTemplates = [
  {
    type: 'reassurance',
    title: 'Reassurance Session',
    icon: Heart,
    description: 'Calming messages focused on safety and comfort',
    color: 'bg-primary/10 text-primary',
    sample: 'You are safe and loved. Everything is going to be okay. Your family is taking care of you...',
  },
  {
    type: 'orientation',
    title: 'Orientation Session',
    icon: Compass,
    description: 'Gentle reminders about time, place, and people',
    color: 'bg-secondary/20 text-secondary-foreground',
    sample: 'Today is [day]. You are at home. Your loved ones are nearby and thinking of you...',
  },
  {
    type: 'calm',
    title: 'Calm Session',
    icon: Brain,
    description: 'Peaceful memories and soothing narratives',
    color: 'bg-accent/40 text-accent-foreground',
    sample: 'Remember the garden you loved? The flowers blooming in spring, the gentle breeze...',
  },
];

export default function SessionGenerator() {
  const { currentPatient } = usePatient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customContent, setCustomContent] = useState('');

  const { data: sessions } = useQuery<Session[]>({
    queryKey: currentPatient ? [`/api/sessions/${currentPatient.id}`] : [],
    enabled: !!currentPatient,
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest<Session>('POST', '/api/sessions', data);
    },
    onSuccess: () => {
      if (currentPatient) {
        queryClient.invalidateQueries({ queryKey: [`/api/sessions/${currentPatient.id}`] });
      }
      toast({
        title: 'Session created!',
        description: 'Your session has been saved to the library.',
      });
      setSelectedType(null);
      setCustomTitle('');
      setCustomContent('');
    },
  });

  const handleGenerateSession = (type: string) => {
    if (!currentPatient) return;

    const template = sessionTemplates.find((t) => t.type === type);
    if (!template) return;

    setSelectedType(type);
    setCustomTitle(template.title);
    setCustomContent(template.sample);
  };

  const handleSaveSession = () => {
    if (!currentPatient || !selectedType || !customTitle || !customContent) {
      toast({
        title: 'Missing information',
        description: 'Please provide a title and content for the session.',
        variant: 'destructive',
      });
      return;
    }

    createSessionMutation.mutate({
      patientId: currentPatient.id,
      type: selectedType,
      title: customTitle,
      content: customContent,
      duration: null,
      audioUrl: null,
    });
  };

  if (selectedType) {
    const template = sessionTemplates.find((t) => t.type === selectedType);
    
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedType(null)}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Customize Session</h1>
              <p className="text-muted-foreground mt-1">{template?.title}</p>
            </div>
          </div>

          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Session Title</Label>
                <Input
                  id="title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter session title"
                  className="h-12 rounded-xl"
                  data-testid="input-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Session Content</Label>
                <Textarea
                  id="content"
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Enter the session narrative..."
                  className="rounded-xl min-h-48"
                  data-testid="input-content"
                />
                <p className="text-sm text-muted-foreground">
                  Edit the content to personalize this session for {currentPatient?.name}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl"
                  onClick={() => setSelectedType(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-12 rounded-xl"
                  onClick={handleSaveSession}
                  disabled={createSessionMutation.isPending}
                  data-testid="button-save-session"
                >
                  {createSessionMutation.isPending ? 'Saving...' : 'Save Session'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Session Generator</h1>
          <p className="text-muted-foreground mt-1">Create personalized memory sessions</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Choose a Template</h2>
          <div className="space-y-4">
            {sessionTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card
                  key={template.type}
                  className="rounded-2xl hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => handleGenerateSession(template.type)}
                  data-testid={`session-template-${template.type}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-full p-4 ${template.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{template.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                        <div className="bg-muted/50 rounded-xl p-4">
                          <p className="text-sm italic text-foreground">{template.sample}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {sessions && sessions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Saved Sessions</h2>
              <Badge variant="secondary">{sessions.length}</Badge>
            </div>
            <div className="space-y-3">
              {sessions.map((session) => (
                <Card key={session.id} className="rounded-xl hover-elevate" data-testid={`session-${session.id}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Play className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{session.title}</p>
                      <p className="text-sm text-muted-foreground capitalize">{session.type} Session</p>
                    </div>
                    <Button size="icon" variant="ghost">
                      <Play className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
