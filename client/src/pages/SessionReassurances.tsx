import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePatient } from '@/contexts/PatientContext';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useLocation } from 'wouter';

export default function SessionReassurances() {
  const { currentPatient } = usePatient();
  const [, setLocation] = useLocation();

  const [comfortSource, setComfortSource] = useState('');
  const [preferredTone, setPreferredTone] = useState<'calm' | 'soft' | 'emotional' | 'friendly'>('calm');
  const [topicsToAvoid, setTopicsToAvoid] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storyText, setStoryText] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  if (!currentPatient) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <EmptyState
            icon={ShieldCheck}
            title="No Patient Profile"
            description="Create a patient profile to start reassurance-based sessions."
            action={{
              label: 'Create Profile',
              onClick: () => setLocation('/patient-setup'),
            }}
          />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <button
          className="flex items-center text-sm text-muted-foreground mb-2"
          onClick={() => setLocation('/session-generator')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to session types
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reassurances session</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Design calming phrases and grounding reminders tailored to
            {" "}
            {currentPatient.name}.
          </p>
        </div>

        <Card className="rounded-2xl relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/70">
              <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Generating reassurance and audio...</span>
              </div>
            </div>
          )}
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">What feels most reassuring?</h2>
            <p className="text-xs text-muted-foreground">
              These answers will help shape a script that feels safe, familiar, and respectful for
              {" "}
              {currentPatient.name}.
            </p>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="comfort-source">Comfort source</Label>
                <Textarea
                  id="comfort-source"
                  className="rounded-xl min-h-[80px]"
                  placeholder="What gives the patient the most comfort? (e.g., certain people, prayers, songs, objects, routines)"
                  value={comfortSource}
                  onChange={(e) => setComfortSource(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  Mention anything that reliably soothes them: names, phrases, music, spiritual
                  practices, or familiar items.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="preferred-tone">Preferred tone</Label>
                <Select
                  value={preferredTone}
                  onValueChange={(val: 'calm' | 'soft' | 'emotional' | 'friendly') => setPreferredTone(val)}
                >
                  <SelectTrigger id="preferred-tone" className="rounded-xl h-11">
                    <SelectValue placeholder="Choose tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calm">Calm</SelectItem>
                    <SelectItem value="soft">Soft</SelectItem>
                    <SelectItem value="emotional">Emotional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  What kind of voice or style usually helps them relax rather than feel overwhelmed?
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="topics-avoid">Topics to avoid</Label>
                <Input
                  id="topics-avoid"
                  className="rounded-xl h-11"
                  placeholder="Which topics should not be mentioned at all? (separate with commas)"
                  value={topicsToAvoid}
                  onChange={(e) => setTopicsToAvoid(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  For example: hospital stays, certain relatives, work stress, specific years or
                  events.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center gap-3">
                {error && (
                  <p className="text-xs text-red-500 truncate">
                    {error}
                  </p>
                )}
                {isLoading && !error && (
                  <p className="text-xs text-muted-foreground ml-auto">
                    Generating reassurance and audio...
                  </p>
                )}
                <Button
                  type="button"
                  className="rounded-xl px-6 h-11 ml-auto"
                  disabled={isLoading}
                  onClick={async () => {
                    if (!currentPatient) return;

                    setIsLoading(true);
                    setError(null);
                    setStoryText(null);
                    if (audioUrl) {
                      URL.revokeObjectURL(audioUrl);
                      setAudioUrl(null);
                    }

                    const language = (currentPatient as any).language ?? 'hi';

                    try {
                      const response = await fetch('http://localhost:8001/api/session-story', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          session_type: 'reassurance',
                          patient: {
                            name: currentPatient.name,
                            language,
                            voice_gender: 'female',
                            dementia_stage: currentPatient.dementiaStage ?? 'early',
                            caregiver_relation: currentPatient.relationship ?? 'caregiver',
                          },
                          answers: {
                            language,
                            comfort_source: comfortSource,
                            preferred_tone: preferredTone,
                            topics_to_avoid: topicsToAvoid,
                          },
                        }),
                      });

                      if (!response.ok) {
                        throw new Error('Failed to generate reassurance');
                      }

                      const data: {
                        story_text: string;
                        audio_base64?: string | null;
                      } = await response.json();

                      setStoryText(data.story_text);

                      let uploadedAudioUrl: string | undefined;

                      if (data.audio_base64) {
                        const byteCharacters = atob(data.audio_base64);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i += 1) {
                          byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        const blob = new Blob([byteArray], { type: 'audio/mpeg' });
                        const url = URL.createObjectURL(blob);
                        setAudioUrl(url);

                        try {
                          const formData = new FormData();
                          formData.append('audio', blob, 'reassurance-session.mp3');
                          const uploadRes = await fetch('/api/upload/audio', {
                            method: 'POST',
                            body: formData,
                          });
                          if (uploadRes.ok) {
                            const uploadData: { url: string } = await uploadRes.json();
                            uploadedAudioUrl = uploadData.url;
                          }
                        } catch (uploadErr) {
                          console.error('Failed to upload audio', uploadErr);
                        }
                      }

                      try {
                        await fetch('/api/sessions', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            patientId: (currentPatient as any).id ?? (currentPatient as any)._id,
                            type: 'reassurance',
                            title: `Reassurance for ${currentPatient.name}`,
                            content: data.story_text,
                            audioUrl: uploadedAudioUrl,
                          }),
                        });
                      } catch (saveErr) {
                        console.error('Failed to save session', saveErr);
                      }
                    } catch (e: any) {
                      setError(e?.message || 'Something went wrong while generating the reassurance.');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  {isLoading ? 'Working...' : 'Continue'}
                </Button>
              </div>

              {storyText && (
                <div className="mt-2 space-y-3">
                  <div className="rounded-xl border bg-muted/30 p-3 text-xs leading-relaxed max-h-64 overflow-y-auto">
                    {storyText}
                  </div>
                  {audioUrl && (
                    <audio
                      className="w-full mt-1"
                      controls
                      src={audioUrl}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
