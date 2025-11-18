import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePatient } from '@/contexts/PatientContext';
import { ArrowLeft, Moon } from 'lucide-react';
import { useLocation } from 'wouter';

export default function SessionNightRoutine() {
  const { currentPatient } = usePatient();
  const [, setLocation] = useLocation();

  const [language, setLanguage] = useState<'hi' | 'en'>('en');
  const [tone, setTone] = useState<'very_calm' | 'soft' | 'cozy'>('very_calm');
  const [nightComfortItem, setNightComfortItem] = useState('');
  const [whoIsNearby, setWhoIsNearby] = useState('');
  const [avoidNightTopics, setAvoidNightTopics] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storyText, setStoryText] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  if (!currentPatient) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <EmptyState
            icon={Moon}
            title="No Patient Profile"
            description="Create a patient profile to start night routine sessions."
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
          <h1 className="text-2xl font-semibold text-foreground">Night routine session</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Design a calming wind-down for {currentPatient.name}, including evening cues, safety
            checks, and pre-sleep rituals.
          </p>
        </div>

        <Card className="rounded-2xl relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/70">
              <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Generating night routine and audio...</span>
              </div>
            </div>
          )}
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Shape the night story</h2>
            <p className="text-xs text-muted-foreground">
              These details will help generate a night routine script that feels safe, cozy, and predictable.
            </p>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={language}
                  onValueChange={(val: 'hi' | 'en') => setLanguage(val)}
                >
                  <SelectTrigger id="language" className="rounded-xl h-11">
                    <SelectValue placeholder="Choose language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (en)</SelectItem>
                    <SelectItem value="hi">Hindi (hi)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  In which language should the night routine story be written/spoken?
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tone">Tone</Label>
                <Select
                  value={tone}
                  onValueChange={(val: 'very_calm' | 'soft' | 'cozy') => setTone(val)}
                >
                  <SelectTrigger id="tone" className="rounded-xl h-11">
                    <SelectValue placeholder="Choose tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very_calm">Very calm</SelectItem>
                    <SelectItem value="soft">Soft</SelectItem>
                    <SelectItem value="cozy">Cozy</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  How should the story sound at night so that it feels gentle and not stimulating?
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="night-comfort-item">Night comfort item</Label>
                <Input
                  id="night-comfort-item"
                  className="rounded-xl h-11"
                  placeholder="What gives the most comfort to the patient at night?"
                  value={nightComfortItem}
                  onChange={(e) => setNightComfortItem(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  e.g., a particular blanket, lamp, prayer, song, someone&apos;s presence, or a routine phrase.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="who-is-nearby">Who is nearby at night?</Label>
                <Input
                  id="who-is-nearby"
                  className="rounded-xl h-11"
                  placeholder="Who is nearby at night (name or relation)?"
                  value={whoIsNearby}
                  onChange={(e) => setWhoIsNearby(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  For example: "Daughter in the next room", "Caregiver in the hall", "Spouse beside you".
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="avoid-night-topics">Topics to avoid at night</Label>
                <Input
                  id="avoid-night-topics"
                  className="rounded-xl h-11"
                  placeholder="Which topics shouldn&apos;t come up at night? (separate with commas)"
                  value={avoidNightTopics}
                  onChange={(e) => setAvoidNightTopics(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  e.g., emergencies, past illnesses, arguments, worrying news, or anything that triggers anxiety.
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
                    Generating night routine and audio...
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

                    try {
                      const response = await fetch('http://localhost:8001/api/session-story', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          session_type: 'night_routine',
                          patient: {
                            name: currentPatient.name,
                            language,
                            voice_gender: 'female',
                            dementia_stage: currentPatient.dementiaStage ?? 'early',
                            caregiver_relation: currentPatient.relationship ?? 'caregiver',
                          },
                          answers: {
                            language,
                            tone,
                            night_comfort_item: nightComfortItem,
                            who_is_nearby: whoIsNearby,
                            avoid_night_topics: avoidNightTopics,
                          },
                        }),
                      });

                      if (!response.ok) {
                        throw new Error('Failed to generate night routine');
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
                          formData.append('audio', blob, 'night-routine-session.mp3');
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
                            type: 'night_routine',
                            title: `Night routine for ${currentPatient.name}`,
                            content: data.story_text,
                            audioUrl: uploadedAudioUrl,
                          }),
                        });
                      } catch (saveErr) {
                        console.error('Failed to save session', saveErr);
                      }
                    } catch (e: any) {
                      setError(e?.message || 'Something went wrong while generating the night routine.');
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
