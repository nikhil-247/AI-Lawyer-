import { User, Heart, Database, Bell, LogOut, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { usePatient } from '@/contexts/PatientContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const settingsSections = [
  {
    title: 'Patient Profile',
    icon: Heart,
    items: [
      { label: 'Edit Profile', action: 'edit-profile' },
      { label: 'Media Library', action: 'media-library' },
    ],
  },
  {
    title: 'Data Management',
    icon: Database,
    items: [
      { label: 'Backup Data', action: 'backup' },
      { label: 'Export Sessions', action: 'export' },
    ],
  },
  {
    title: 'Preferences',
    icon: Bell,
    items: [
      { label: 'Notifications', action: 'notifications' },
      { label: 'Schedule Settings', action: 'schedule-settings' },
    ],
  },
];

export default function Settings() {
  const { user, logout } = useAuth();
  const { currentPatient } = usePatient();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation('/welcome');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 rounded-full border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentPatient && (
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Current Patient</h3>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 rounded-full">
                  <AvatarImage src={currentPatient.photoUrl || undefined} />
                  <AvatarFallback className="bg-secondary/20 text-secondary-foreground">
                    {currentPatient.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{currentPatient.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Age {currentPatient.age} • {currentPatient.relationship}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                </div>
                <Card className="rounded-2xl">
                  <CardContent className="p-0">
                    {section.items.map((item, index) => (
                      <button
                        key={item.action}
                        className={`w-full flex items-center justify-between p-4 hover-elevate active-elevate-2 ${
                          index !== section.items.length - 1 ? 'border-b border-border' : ''
                        } ${index === 0 ? 'rounded-t-2xl' : ''} ${
                          index === section.items.length - 1 ? 'rounded-b-2xl' : ''
                        }`}
                        data-testid={`setting-${item.action}`}
                      >
                        <span className="text-foreground font-medium">{item.label}</span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <Card className="rounded-2xl border-destructive/20">
          <CardContent className="p-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive h-12"
                  data-testid="button-logout"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Sign Out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to sign out? You'll need to log in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="rounded-xl"
                    data-testid="button-confirm-logout"
                  >
                    Sign Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Memory Reconstruction Assistant v1.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            With care, for those who care
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
