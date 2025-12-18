import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Rocket, FlaskConical, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/learn', icon: BookOpen, label: 'Learn' },
  { path: '/anatomy', icon: Rocket, label: 'Anatomy' },
  { path: '/lab', icon: FlaskConical, label: 'Lab' },
  { path: '/mission', icon: Moon, label: 'Mission' },
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'nav-item flex-1',
                isActive && 'active'
              )}
            >
              <Icon 
                className={cn(
                  'w-6 h-6 transition-all duration-300',
                  isActive && 'scale-110'
                )} 
              />
              <span className={cn(
                'text-xs font-medium transition-all duration-300',
                isActive && 'font-semibold'
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
