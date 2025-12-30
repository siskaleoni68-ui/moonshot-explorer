import { useEffect, useState } from 'react';
import { Rocket, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnlockCelebrationProps {
  show: boolean;
  moduleName: string;
  onComplete: () => void;
}

export function UnlockCelebration({ show, moduleName, onComplete }: UnlockCelebrationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; type: 'star' | 'sparkle' }>>([]);
  
  useEffect(() => {
    if (show) {
      // Generate random particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        type: Math.random() > 0.5 ? 'star' : 'sparkle' as 'star' | 'sparkle',
      }));
      setParticles(newParticles);
      
      // Auto-dismiss after animation
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      onClick={onComplete}
    >
      {/* Backdrop with radial glow */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-auto animate-fade-in" />
      
      {/* Particle effects */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-particle-rise"
          style={{
            left: `${particle.x}%`,
            bottom: '20%',
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.type === 'star' ? (
            <Star className="w-4 h-4 text-star fill-star" />
          ) : (
            <Sparkles className="w-3 h-3 text-primary" />
          )}
        </div>
      ))}
      
      {/* Central celebration content */}
      <div className="relative z-10 text-center animate-scale-in pointer-events-auto">
        {/* Glowing rocket icon */}
        <div className="relative mx-auto mb-6">
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-primary/30 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-b from-primary to-accent flex items-center justify-center animate-bounce">
            <Rocket className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>
        
        {/* Text */}
        <h2 className="font-display text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-star bg-clip-text text-transparent animate-fade-in">
          Module Unlocked!
        </h2>
        <p className="text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
          You can now access
        </p>
        <p className="text-xl font-semibold text-foreground mt-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {moduleName}
        </p>
        
        {/* Tap to continue */}
        <p className="text-sm text-muted-foreground/70 mt-6 animate-pulse">
          Tap to continue
        </p>
      </div>
      
      {/* Ring effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 rounded-full border-2 border-primary/50 animate-ping" style={{ animationDuration: '1.5s' }} />
      </div>
    </div>
  );
}
