import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';
import { EmptyState } from '@/components/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { usePatient } from '@/contexts/PatientContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { Schedule, Session } from '@shared/schema';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function SchedulePage() {
  const { currentPatient } = usePatient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [time, setTime] = useState('09:00');

  const { data: schedules, isLoading } = useQuery<Schedule[]>({
    queryKey: currentPatient ? [`/api/schedules/${currentPatient.id}`] : [],
    enabled: !!currentPatient,
  });

  const { data: sessions } = useQuery<Session[]>({
    queryKey: currentPatient ? [`/api/sessions/${currentPatient.id}`] : [],
    enabled: !!currentPatient,
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest<Schedule>('POST', '/api/schedules', data);
    },
    onSuccess: () => {
      if (currentPatient) {
        queryClient.invalidateQueries({ queryKey: [`/api/schedules/${currentPatient.id}`] });
        queryClient.invalidateQueries({ queryKey: [`/api/schedules/${currentPatient.id}/upcoming`] });
      }
      toast({
        title: 'Schedule created!',
        description: 'Your session has been scheduled successfully.',
      });
      setIsDialogOpen(false);
      setSelectedDays([]);
      setSelectedSession('');
      setTime('09:00');
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/schedules/${id}`, {});
    },
    onSuccess: () => {
      if (currentPatient) {
        queryClient.invalidateQueries({ queryKey: [`/api/schedules/${currentPatient.id}`] });
        queryClient.invalidateQueries({ queryKey: [`/api/schedules/${currentPatient.id}/upcoming`] });
      }
      toast({
        title: 'Schedule deleted',
        description: 'The schedule has been removed.',
      });
    },
  });

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleCreateSchedule = () => {
    if (!currentPatient || !selectedSession || selectedDays.length === 0 || !time) {
      toast({
        title: 'Missing information',
        description: 'Please select a session, at least one day, and a time.',
        variant: 'destructive',
      });
      return;
    }

    createScheduleMutation.mutate({
      sessionId: selectedSession,
      patientId: currentPatient.id,
      time,
      days: selectedDays,
      isActive: true,
      outputDevice: null,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Schedule</h1>
            <p className="text-muted-foreground mt-1">Manage session schedules</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl h-12" data-testid="button-add-schedule">
                <Plus className="h-4 w-4 mr-2" />
                New Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-2xl">
              <DialogHeader>
                <DialogTitle>Create Schedule</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="session">Select Session</Label>
                  <Select value={selectedSession} onValueChange={setSelectedSession}>
                    <SelectTrigger className="h-12 rounded-xl" data-testid="select-session">
                      <SelectValue placeholder="Choose a session" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions?.map((session) => (
                        <SelectItem key={session.id} value={session.id}>
                          {session.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Days of Week</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {daysOfWeek.map((day) => (
                      <Button
                        key={day}
                        variant={selectedDays.includes(day) ? 'default' : 'outline'}
                        className="h-10 rounded-xl"
                        onClick={() => toggleDay(day)}
                        data-testid={`day-${day}`}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="h-12 rounded-xl"
                    data-testid="input-time"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-xl"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 h-12 rounded-xl"
                    onClick={handleCreateSchedule}
                    disabled={createScheduleMutation.isPending}
                    data-testid="button-save-schedule"
                  >
                    {createScheduleMutation.isPending ? 'Creating...' : 'Create Schedule'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="rounded-xl">
                <CardContent className="p-4 h-24" />
              </Card>
            ))}
          </div>
        ) : schedules && schedules.length > 0 ? (
          <div className="space-y-3">
            {schedules.map((schedule) => {
              const session = sessions?.find((s) => s.id === schedule.sessionId);
              return (
                <Card key={schedule.id} className="rounded-xl hover-elevate" data-testid={`schedule-${schedule.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="font-semibold text-foreground">{session?.title || 'Session'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{schedule.time}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {schedule.days.map((day) => (
                            <Badge key={day} variant="secondary" className="text-xs">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteScheduleMutation.mutate(schedule.id)}
                        data-testid={`button-delete-${schedule.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={CalendarIcon}
            title="No Schedules Yet"
            description="Create a schedule to automatically play sessions at specific times."
            action={{
              label: 'Create First Schedule',
              onClick: () => setIsDialogOpen(true),
            }}
          />
        )}
      </div>

      <BottomNav />
    </div>
  );
}
