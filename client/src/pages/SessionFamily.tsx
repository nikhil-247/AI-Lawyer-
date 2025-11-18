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
import { ArrowLeft, Users } from 'lucide-react';
import { useLocation } from 'wouter';

export default function SessionFamily() {
  const { currentPatient } = usePatient();
  const [, setLocation] = useLocation();

  const [language, setLanguage] = useState<'hi' | 'en'>('en');
  const [tone, setTone] = useState<'emotional' | 'calm' | 'cheerful'>('calm');
  const [familyRole, setFamilyRole] = useState<string>('son');
  const [familyRoleOther, setFamilyRoleOther] = useState<string>('');
  const [familyVibe, setFamilyVibe] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storyText, setStoryText] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  if (!currentPatient) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <EmptyState
            icon={Users}
            title="No Patient Profile"
            description="Create a patient profile to start family-focused sessions."
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
          <h1 className="text-2xl font-semibold text-foreground">Family relation session</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            You can design prompts and recordings here that focus on the most important people in
            {" "}
            {currentPatient.name}&apos;s life.
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
            <h2 className="text-lg font-semibold text-foreground">Who is this session about?</h2>
            <p className="text-xs text-muted-foreground">
              These details help shape the tone and language of the story or reassurance script.
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
                  Choose the language in which the final story or script should be generated.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tone">Tone</Label>
                <Select
                  value={tone}
                  onValueChange={(val: 'emotional' | 'calm' | 'cheerful') => setTone(val)}
                >
                  <SelectTrigger id="tone" className="rounded-xl h-11">
                    <SelectValue placeholder="Choose tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emotional">Emotional</SelectItem>
                    <SelectItem value="calm">Calm</SelectItem>
                    <SelectItem value="cheerful">Cheerful</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  How should this family story feel when read or listened to?
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="family-role">Family member</Label>
                <Select
                  value={familyRole}
                  onValueChange={(val: string) => setFamilyRole(val)}
                >
                  <SelectTrigger id="family-role" className="rounded-xl h-11">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="son">Son</SelectItem>
                    <SelectItem value="daughter">Daughter</SelectItem>
                    <SelectItem value="sister">Sister</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="other">Other (type manually)</SelectItem>
                  </SelectContent>
                </Select>
                {familyRole === 'other' && (
                  <Input
                    className="rounded-xl h-11 mt-1"
                    placeholder="Write the relationship (e.g., neighbour, uncle, caregiver)"
                    value={familyRoleOther}
                    onChange={(e) => setFamilyRoleOther(e.target.value)}
                  />
                )}
                <p className="text-[11px] text-muted-foreground">
                  Who is this session centred around in {currentPatient.name}&apos;s life?
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="family-vibe">Family vibe (2–3 words)</Label>
                <Input
                  id="family-vibe"
                  className="rounded-xl h-11"
                  placeholder="e.g., warm and playful, calm and steady"
                  value={familyVibe}
                  onChange={(e) => setFamilyVibe(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  How would you describe the overall feeling of this family in just a few words?
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

                    const finalFamilyName =
                      familyRole === 'other' && familyRoleOther.trim()
                        ? familyRoleOther.trim()
                        : familyRole;

                    try {
                      const response = await fetch('http://localhost:8001/api/session-story', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          session_type: 'family',
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
                            family_names: finalFamilyName,
                            family_vibe_keywords: familyVibe,
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
                          formData.append('audio', blob, 'family-session.mp3');
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
                            type: 'family',
                            title: `Family session for ${currentPatient.name}`,
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
