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
import { ArrowLeft, BookHeart } from 'lucide-react';
import { useLocation } from 'wouter';

export default function SessionCoreMemories() {
  const { currentPatient } = usePatient();
  const [, setLocation] = useLocation();

  const [memoryPerson, setMemoryPerson] = useState('');
  const [relation, setRelation] = useState('');
  const [category, setCategory] = useState('home');
  const [eventTitle, setEventTitle] = useState('');
  const [momentDetail, setMomentDetail] = useState('');
  const [yearPlace, setYearPlace] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storyText, setStoryText] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  if (!currentPatient) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <EmptyState
            icon={BookHeart}
            title="No Patient Profile"
            description="Create a patient profile to start core memory sessions."
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
          <h1 className="text-2xl font-semibold text-foreground">Core memories session</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Here you can build a session that gently revisits cherished life moments for
            {" "}
            {currentPatient.name}.
          </p>
        </div>

        <Card className="rounded-2xl relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/70">
              <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Generating session and audio...</span>
              </div>
            </div>
          )}
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Tell us about this memory</h2>
            <p className="text-xs text-muted-foreground">
              These details will help shape how this core memory is described in a story or script.
            </p>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="memory-person">Memory person</Label>
                <Input
                  id="memory-person"
                  className="rounded-xl h-11"
                  placeholder="This memory is associated with whom? (name)"
                  value={memoryPerson}
                  onChange={(e) => setMemoryPerson(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  For example: Rohan, Grandma Meera, my younger sister, etc.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="relation">Relation</Label>
                <Input
                  id="relation"
                  className="rounded-xl h-11"
                  placeholder="How is this person related to you?"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  e.g., cousin, school friend, neighbour, daughter.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Memory category</Label>
                <Select
                  value={category}
                  onValueChange={(val: string) => setCategory(val)}
                >
                  <SelectTrigger id="category" className="rounded-xl h-11">
                    <SelectValue placeholder="Choose memory category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  What type of memory is this moment mostly about?
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="event-title">Event title</Label>
                <Input
                  id="event-title"
                  className="rounded-xl h-11"
                  placeholder="Give this memory a short title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  e.g., "First day at college", "Diwali at Nani&apos;s house".
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="moment-detail">Moment detail (2–4 lines)</Label>
                <Textarea
                  id="moment-detail"
                  className="rounded-xl min-h-[96px]"
                  placeholder="Write in 2–4 lines what happened at that moment"
                  value={momentDetail}
                  onChange={(e) => setMomentDetail(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  Focus on sights, sounds, and feelings that made this memory special.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="year-place">Year & place</Label>
                <Input
                  id="year-place"
                  className="rounded-xl h-11"
                  placeholder="Approximate year & place (e.g. 2012, Raipur)"
                  value={yearPlace}
                  onChange={(e) => setYearPlace(e.target.value)}
                />
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
                    Generating story and audio...
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
                          session_type: 'core_memory',
                          patient: {
                            name: currentPatient.name,
                            language,
                            voice_gender: 'female',
                            dementia_stage: currentPatient.dementiaStage ?? 'early',
                            caregiver_relation: currentPatient.relationship ?? 'caregiver',
                          },
                          answers: {
                            language,
                            memory_person: memoryPerson,
                            relation,
                            category,
                            event_title: eventTitle,
                            moment_detail: momentDetail,
                            year_place: yearPlace,
                          },
                        }),
                      });

                      if (!response.ok) {
                        throw new Error('Failed to generate story');
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
                          formData.append('audio', blob, 'core-memory-session.mp3');
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
                            type: 'core_memory',
                            title: eventTitle || `Core memory for ${currentPatient.name}`,
                            content: data.story_text,
                            audioUrl: uploadedAudioUrl,
                          }),
                        });
                      } catch (saveErr) {
                        console.error('Failed to save session', saveErr);
                      }
                    } catch (e: any) {
                      setError(e?.message || 'Something went wrong while generating the story.');
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
