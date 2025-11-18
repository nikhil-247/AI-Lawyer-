import { Sparkles, Users, HeartHandshake, ShieldCheck, Sun, Moon } from 'lucide-react';
import { Link } from 'wouter';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { usePatient } from '@/contexts/PatientContext';

export default function SessionGenerator() {
  const { currentPatient } = usePatient();

  if (!currentPatient) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <EmptyState
            icon={Sparkles}
            title="Select or create a patient"
            description="You need a patient profile before generating therapeutic sessions."
            action={{
              label: 'Create Profile',
              onClick: () => {},
            }}
          />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Generate Therapeutic Session</h1>
          <p className="text-muted-foreground mt-1">
            Choose the focus for this new session. Each pathway will guide you through tailored prompts.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Session focus
          </p>
          <div className="grid gap-4">
          <Link href="/session-family">
            <Card className="rounded-2xl hover-elevate active-elevate-2 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Family relation</h2>
                    <p className="text-sm text-muted-foreground">
                      Focus on key relationships and supportive figures in the patient&apos;s life.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/session-core-memories">
            <Card className="rounded-2xl hover-elevate active-elevate-2 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-secondary/20 p-3">
                    <HeartHandshake className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Core memories</h2>
                    <p className="text-sm text-muted-foreground">
                      Build a session around cherished memories and meaningful life moments.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/session-reassurances">
            <Card className="rounded-2xl hover-elevate active-elevate-2 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-100 p-3">
                    <ShieldCheck className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Reassurances</h2>
                    <p className="text-sm text-muted-foreground">
                      Create a calming script with grounding phrases and emotional safety.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/session-morning-routine">
            <Card className="rounded-2xl hover-elevate active-elevate-2 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-amber-100 p-3">
                    <Sun className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Morning routine</h2>
                    <p className="text-sm text-muted-foreground">
                      Capture gentle morning rituals, from wake-up cues to first calming activities.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/session-night-routine">
            <Card className="rounded-2xl hover-elevate active-elevate-2 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-slate-900/90 p-3">
                    <Moon className="h-6 w-6 text-slate-100" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Night routine</h2>
                    <p className="text-sm text-muted-foreground">
                      Design a soothing wind-down sequence to ease into safe, restful sleep.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
