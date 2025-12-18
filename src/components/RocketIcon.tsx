import { cn } from '@/lib/utils';

interface RocketIconProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export function RocketIcon({ className, size = 120, animated = true }: RocketIconProps) {
  return (
    <div className={cn(animated && 'rocket-float', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rocket body */}
        <path
          d="M60 10C60 10 40 30 40 60C40 75 45 85 50 92H70C75 85 80 75 80 60C80 30 60 10 60 10Z"
          fill="url(#rocketBody)"
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
        />
        
        {/* Rocket nose */}
        <path
          d="M60 10C60 10 50 25 50 35C50 35 55 30 60 30C65 30 70 35 70 35C70 25 60 10 60 10Z"
          fill="hsl(var(--primary))"
        />
        
        {/* Window */}
        <circle
          cx="60"
          cy="50"
          r="8"
          fill="hsl(var(--accent))"
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
        />
        <circle cx="58" cy="48" r="2" fill="hsl(var(--foreground) / 0.5)" />
        
        {/* Left fin */}
        <path
          d="M40 70L25 90L40 85V70Z"
          fill="hsl(var(--primary))"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.5"
        />
        
        {/* Right fin */}
        <path
          d="M80 70L95 90L80 85V70Z"
          fill="hsl(var(--primary))"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.5"
        />
        
        {/* Flame */}
        <path
          d="M50 92C50 92 55 105 60 110C65 105 70 92 70 92"
          fill="hsl(var(--rocket-flame))"
          className="animate-pulse"
        />
        <path
          d="M53 92C53 92 57 100 60 103C63 100 67 92 67 92"
          fill="hsl(var(--star-yellow))"
          className="animate-pulse"
        />
        
        <defs>
          <linearGradient id="rocketBody" x1="40" y1="10" x2="80" y2="92" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(var(--card))" />
            <stop offset="1" stopColor="hsl(var(--muted))" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
