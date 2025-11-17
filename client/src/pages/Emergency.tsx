import { useState } from 'react';
import { Heart, Play, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AudioPlayer } from '@/components/AudioPlayer';
import { usePatient } from '@/contexts/PatientContext';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const emergencyScript = `You are safe. You are loved. Everything is going to be okay.

Take a deep breath with me. In... and out...

You are at home, surrounded by people who care about you. Your family is nearby.

There's nothing to worry about right now. You are exactly where you need to be.

Let's breathe together again. In... and out...

You are doing wonderfully. Everything is peaceful and calm.`;

export default function Emergency() {
  const { currentPatient } = usePatient();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [notes, setNotes] = useState('');

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/feedback', data);
    },
    onSuccess: () => {
      toast({
        title: 'Feedback saved',
        description: 'Thank you for the feedback.',
      });
      setShowFeedback(false);
      setSelectedEmoji('');
      setNotes('');
    },
  });

  const handlePlaySession = () => {
    setIsPlaying(true);
    toast({
      title: 'Playing reassurance session',
      description: 'A calming message for comfort.',
    });
  };

  const handleSessionComplete = () => {
    setIsPlaying(false);
    setShowFeedback(true);
  };

  const handleFeedbackSubmit = () => {
    if (!currentPatient || !selectedEmoji) {
      toast({
        title: 'Please select a response',
        description: 'Let us know how the session went.',
        variant: 'destructive',
      });
      return;
    }

    submitFeedbackMutation.mutate({
      sessionId: 'emergency-session',
      patientId: currentPatient.id,
      emoji: selectedEmoji,
      notes,
      anxietyLevel: null,
    });
  };

  const emojis = [
    { value: 'positive', emoji: '😊', label: 'Helpful' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'negative', emoji: '☹️', label: 'Not Helpful' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-destructive/10 p-6">
              <Heart className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Emergency Mode</h1>
          <p className="text-muted-foreground">Quick reassurance when needed most</p>
        </div>

        {!isPlaying ? (
          <Card className="rounded-2xl border-destructive/20">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground text-center">
                  Immediate Calm Session
                </h2>
                <p className="text-muted-foreground text-center text-sm">
                  Play a soothing reassurance message to help restore calm and comfort
                </p>
              </div>

              <Button
                className="w-full h-16 text-lg rounded-2xl"
                size="lg"
                onClick={handlePlaySession}
                data-testid="button-play-emergency"
              >
                <Play className="h-6 w-6 mr-3" />
                Play Reassurance Session
              </Button>

              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-foreground">
                  <FileText className="h-4 w-4" />
                  <p className="text-sm font-medium">Session Preview</p>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {emergencyScript.split('\n').slice(0, 3).join('\n')}...
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <AudioPlayer
            title="Emergency Reassurance Session"
            onComplete={handleSessionComplete}
          />
        )}

        <Card className="rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">When to Use</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>During moments of confusion or anxiety</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>When needing immediate emotional support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>To help with grounding and orientation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>As a calming intervention before bedtime</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>How did it go?</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Was this session helpful?</Label>
              <div className="grid grid-cols-3 gap-4">
                {emojis.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setSelectedEmoji(item.value)}
                    className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all ${
                      selectedEmoji === item.value
                        ? 'border-primary bg-primary/5 scale-105'
                        : 'border-border hover-elevate active-elevate-2'
                    }`}
                    data-testid={`emoji-${item.value}`}
                  >
                    <span className="text-5xl">{item.emoji}</span>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What caused the confusion or anxiety?"
                className="rounded-xl min-h-24"
                data-testid="input-notes"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl"
                onClick={() => setShowFeedback(false)}
              >
                Skip
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl"
                onClick={handleFeedbackSubmit}
                disabled={submitFeedbackMutation.isPending}
                data-testid="button-submit-feedback"
              >
                {submitFeedbackMutation.isPending ? 'Saving...' : 'Submit Feedback'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
