import { Link, useLocation } from 'wouter';
import { Home, Calendar, AlertCircle, Settings } from 'lucide-react';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/schedule', icon: Calendar, label: 'Schedule' },
  { path: '/emergency', icon: AlertCircle, label: 'Emergency' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border h-20 z-50">
      <div className="flex items-center justify-around h-full max-w-2xl mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <button
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[64px] ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover-elevate active-elevate-2'
                }`}
              >
                <Icon className={`h-6 w-6 ${isActive ? 'fill-primary' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
