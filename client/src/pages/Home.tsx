import { Plus, Play, Calendar as CalendarIcon, Brain } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';
import { EmptyState } from '@/components/EmptyState';
import { usePatient } from '@/contexts/PatientContext';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import type { Session, Schedule } from '@shared/schema';

export default function Home() {
  const { currentPatient } = usePatient();

  const { data: recentSessions, isLoading: sessionsLoading } = useQuery<Session[]>({
    queryKey: currentPatient ? [`/api/sessions/${currentPatient.id}`] : [],
    enabled: !!currentPatient,
  });

  const { data: upcomingSchedules, isLoading: schedulesLoading } = useQuery<Schedule[]>({
    queryKey: currentPatient ? [`/api/schedules/${currentPatient.id}/upcoming`] : [],
    enabled: !!currentPatient,
  });

  if (!currentPatient) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <EmptyState
            icon={Brain}
            title="No Patient Profile"
            description="Create a patient profile to get started with memory building."
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
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back</p>
        </div>

        <Card className="rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 rounded-full border-4 border-primary/20">
                <AvatarImage src={currentPatient.photoUrl || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                  {currentPatient.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">{currentPatient.name}</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Age {currentPatient.age} • {currentPatient.relationship}
                </p>
                <Badge variant="secondary" className="mt-2">
                  {currentPatient.dementiaStage.charAt(0).toUpperCase() + currentPatient.dementiaStage.slice(1)} Stage
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/memory-builder">
              <Card className="hover-elevate active-elevate-2 cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Add Memory</h3>
                    <p className="text-xs text-muted-foreground mt-1">Create new memory</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/session-generator">
              <Card className="hover-elevate active-elevate-2 cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="rounded-full bg-secondary/30 p-4">
                    <Brain className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">New Session</h3>
                    <p className="text-xs text-muted-foreground mt-1">Generate session</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/schedule">
              <Card className="hover-elevate active-elevate-2 cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="rounded-full bg-accent/50 p-4">
                    <CalendarIcon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Schedule</h3>
                    <p className="text-xs text-muted-foreground mt-1">Manage schedule</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/emergency">
              <Card className="hover-elevate active-elevate-2 cursor-pointer h-full border-destructive/20">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="rounded-full bg-destructive/10 p-4">
                    <Play className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Emergency</h3>
                    <p className="text-xs text-muted-foreground mt-1">Quick calm</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Upcoming Sessions</h2>
          {schedulesLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Card key={i} className="rounded-xl">
                  <CardContent className="p-4">
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingSchedules && upcomingSchedules.length > 0 ? (
            <div className="space-y-3">
              {upcomingSchedules.slice(0, 3).map((schedule) => (
                <Card key={schedule.id} className="rounded-xl hover-elevate">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Scheduled Session</p>
                      <p className="text-sm text-muted-foreground">{schedule.time}</p>
                    </div>
                    <Badge variant="outline">{schedule.days.join(', ')}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-xl">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No upcoming sessions scheduled</p>
              </CardContent>
            </Card>
          )}
        </div>

        {recentSessions && recentSessions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Sessions</h2>
            <div className="space-y-3">
              {recentSessions.slice(0, 2).map((session) => (
                <Card key={session.id} className="rounded-xl hover-elevate">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="rounded-full bg-secondary/20 p-3">
                      <Play className="h-5 w-5 text-secondary-foreground" />
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
