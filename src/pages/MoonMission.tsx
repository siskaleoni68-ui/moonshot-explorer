import { useState, useCallback, useEffect } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AudioControls } from '@/components/AudioControls';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSound } from '@/hooks/useSound';
import { Rocket, Play, RotateCcw, CheckCircle, XCircle, ChevronRight, Moon, Globe, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type MissionPhase = 'ready' | 'launch' | 'orbit' | 'transfer' | 'descent' | 'landing' | 'success' | 'failure';

interface PhaseInfo {
  name: string;
  description: string;
  duration: number;
  successRate: number;
}

const phases: Record<MissionPhase, PhaseInfo> = {
  ready: { name: 'Ready', description: 'Prepare for launch', duration: 0, successRate: 1 },
  launch: { name: 'Earth Launch', description: 'Escape Earth\'s atmosphere', duration: 3000, successRate: 0.95 },
  orbit: { name: 'Orbit Stabilization', description: 'Achieve stable parking orbit', duration: 2500, successRate: 0.9 },
  transfer: { name: 'Moon Transfer', description: 'Trans-lunar injection burn', duration: 3000, successRate: 0.92 },
  descent: { name: 'Lunar Descent', description: 'Begin powered descent', duration: 2500, successRate: 0.88 },
  landing: { name: 'Soft Landing', description: 'Touch down on the Moon', duration: 3000, successRate: 0.85 },
  success: { name: 'Mission Complete', description: 'Successful Moon landing!', duration: 0, successRate: 1 },
  failure: { name: 'Mission Failed', description: 'Better luck next time', duration: 0, successRate: 1 },
};

const phaseOrder: MissionPhase[] = ['ready', 'launch', 'orbit', 'transfer', 'descent', 'landing', 'success'];

export default function MoonMission() {
  const [currentPhase, setCurrentPhase] = useState<MissionPhase>('ready');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [missionScore, setMissionScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [completedPhases, setCompletedPhases] = useState<MissionPhase[]>([]);
  const { playSound } = useSound();

  const currentPhaseIndex = phaseOrder.indexOf(currentPhase);

  const startMission = useCallback(() => {
    setIsRunning(true);
    setCurrentPhase('launch');
    setPhaseProgress(0);
    setCompletedPhases([]);
    setFailureReason(null);
    setAttempts(prev => prev + 1);
    playSound('launch');
    toast.info('Mission Started!', { description: '3... 2... 1... Liftoff!' });
  }, [playSound]);

  const resetMission = useCallback(() => {
    setCurrentPhase('ready');
    setPhaseProgress(0);
    setIsRunning(false);
    setFailureReason(null);
    setCompletedPhases([]);
  }, []);

  useEffect(() => {
    if (!isRunning || currentPhase === 'ready' || currentPhase === 'success' || currentPhase === 'failure') {
      return;
    }

    const phase = phases[currentPhase];
    const progressInterval = setInterval(() => {
      setPhaseProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          
          // Check for success/failure
          const roll = Math.random();
          if (roll > phase.successRate) {
            // Mission failed
            setCurrentPhase('failure');
            setIsRunning(false);
            playSound('error');
            const reasons = [
              'Engine malfunction during ' + phase.name.toLowerCase(),
              'Navigation error detected',
              'Fuel exhausted prematurely',
              'Communication lost',
              'Unexpected system failure',
            ];
            const reason = reasons[Math.floor(Math.random() * reasons.length)];
            setFailureReason(reason);
            toast.error('Mission Failed', { description: reason });
            return 100;
          }

          // Phase complete, move to next
          setCompletedPhases(prev => [...prev, currentPhase]);
          playSound('notification');
          const nextIndex = phaseOrder.indexOf(currentPhase) + 1;
          if (nextIndex < phaseOrder.length) {
            const nextPhase = phaseOrder[nextIndex];
            if (nextPhase === 'success') {
              setCurrentPhase('success');
              setIsRunning(false);
              setMissionScore(prev => prev + 100);
              playSound('complete');
              toast.success('Mission Complete!', { description: 'You landed on the Moon!' });
            } else {
              setCurrentPhase(nextPhase);
              toast.success(phase.name + ' Complete!');
            }
          }
          return 0;
        }
        return prev + 2;
      });
    }, phase.duration / 50);

    return () => clearInterval(progressInterval);
  }, [isRunning, currentPhase, playSound]);

  const getPhaseIcon = (phase: MissionPhase) => {
    switch (phase) {
      case 'launch': return <ArrowUp className="w-4 h-4" />;
      case 'orbit': return <Globe className="w-4 h-4" />;
      case 'transfer': return <Rocket className="w-4 h-4" />;
      case 'descent': return <Moon className="w-4 h-4" />;
      case 'landing': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-4 safe-area-pt">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Moon Mission</h1>
            <p className="text-sm text-muted-foreground mt-1">Land safely on the lunar surface</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="font-display font-bold text-lg text-primary">{missionScore}</p>
            </div>
            <AudioControls showVolumeControls />
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Mission visualization */}
        <Card className="relative overflow-hidden bg-gradient-to-b from-space-void via-space-deep to-background min-h-[280px]">
          {/* Stars */}
          <div className="absolute inset-0 stars-bg" />
          
          {/* Earth */}
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gradient-to-br from-nebula-blue to-success opacity-80" />
          
          {/* Moon */}
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-moon-silver to-muted" />

          {/* Rocket position based on phase */}
          <div 
            className={cn(
              'absolute transition-all duration-1000 ease-in-out',
              currentPhase === 'ready' && 'bottom-8 left-8',
              currentPhase === 'launch' && 'bottom-1/3 left-1/4',
              currentPhase === 'orbit' && 'bottom-1/2 left-1/3',
              currentPhase === 'transfer' && 'top-1/3 right-1/3',
              currentPhase === 'descent' && 'top-1/4 right-1/4',
              currentPhase === 'landing' && 'top-8 right-8',
              currentPhase === 'success' && 'top-6 right-6',
              currentPhase === 'failure' && 'bottom-1/2 left-1/2 rotate-45 opacity-50',
            )}
          >
            <svg 
              width="40" 
              height="60" 
              viewBox="0 0 40 60"
              className={cn(
                isRunning && 'animate-pulse',
                currentPhase === 'transfer' && 'rotate-45',
                currentPhase === 'descent' && 'rotate-90',
                currentPhase === 'landing' && 'rotate-180',
                currentPhase === 'success' && 'rotate-180',
              )}
            >
              <path d="M20 0L12 15H28L20 0Z" fill="hsl(var(--primary))" />
              <rect x="12" y="15" width="16" height="25" fill="hsl(var(--card))" />
              <path d="M12 40H28L32 50H8L12 40Z" fill="hsl(var(--muted))" />
              {isRunning && currentPhase !== 'success' && currentPhase !== 'failure' && (
                <g className="animate-pulse">
                  <path d="M15 50C15 50 17 55 20 60C23 55 25 50 25 50" fill="hsl(var(--rocket-flame))" />
                </g>
              )}
            </svg>
          </div>

          {/* Phase indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full">
            <p className="text-sm font-medium">{phases[currentPhase].name}</p>
          </div>
        </Card>

        {/* Current phase progress */}
        {isRunning && currentPhase !== 'success' && currentPhase !== 'failure' && (
          <Card className="p-5 animate-scale-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getPhaseIcon(currentPhase)}
                <span className="font-medium">{phases[currentPhase].name}</span>
              </div>
              <Badge variant="secondary">{Math.round(phaseProgress)}%</Badge>
            </div>
            <Progress value={phaseProgress} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">{phases[currentPhase].description}</p>
          </Card>
        )}

        {/* Mission phases checklist */}
        <Card className="p-5">
          <h3 className="font-display font-semibold mb-4">Mission Phases</h3>
          <div className="space-y-3">
            {phaseOrder.slice(1, -1).map((phase, index) => {
              const isCompleted = completedPhases.includes(phase);
              const isCurrent = currentPhase === phase;
              const isPending = !isCompleted && !isCurrent && currentPhase !== 'success' && currentPhase !== 'failure';

              return (
                <div
                  key={phase}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl transition-colors',
                    isCompleted && 'bg-success/10',
                    isCurrent && 'bg-primary/10',
                    isPending && 'bg-muted/30 opacity-50'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    isCompleted && 'bg-success',
                    isCurrent && 'bg-primary animate-pulse',
                    isPending && 'bg-muted'
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-success-foreground" />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      'font-medium text-sm',
                      isCompleted && 'text-success',
                      isCurrent && 'text-primary'
                    )}>
                      {phases[phase].name}
                    </p>
                    <p className="text-xs text-muted-foreground">{phases[phase].description}</p>
                  </div>
                  {isCurrent && <ChevronRight className="w-4 h-4 text-primary animate-pulse" />}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Success/Failure result */}
        {(currentPhase === 'success' || currentPhase === 'failure') && (
          <Card className={cn(
            'p-6 animate-scale-in text-center',
            currentPhase === 'success' ? 'bg-success/10 border-success/50' : 'bg-destructive/10 border-destructive/50'
          )}>
            {currentPhase === 'success' ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-display text-2xl font-bold text-success">Mission Success!</h3>
                <p className="text-muted-foreground mt-2">You successfully landed on the Moon!</p>
                <p className="text-sm mt-4">+100 points added to your score</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-display text-2xl font-bold text-destructive">Mission Failed</h3>
                <p className="text-muted-foreground mt-2">{failureReason}</p>
                <p className="text-sm mt-4">Review the basics and try again!</p>
              </>
            )}
          </Card>
        )}

        {/* Stats */}
        <Card className="p-5 bg-muted/30">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-2xl font-display font-bold">{attempts}</p>
              <p className="text-xs text-muted-foreground">Attempts</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="text-2xl font-display font-bold text-success">{missionScore / 100}</p>
              <p className="text-xs text-muted-foreground">Landings</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="text-2xl font-display font-bold text-primary">
                {attempts > 0 ? Math.round((missionScore / 100 / attempts) * 100) : 0}%
              </p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-3">
          {currentPhase === 'ready' ? (
            <Button
              onClick={startMission}
              size="lg"
              className="flex-1 h-14 text-lg font-semibold rounded-2xl pulse-glow"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Mission
            </Button>
          ) : !isRunning ? (
            <Button
              onClick={resetMission}
              size="lg"
              className="flex-1 h-14 text-lg font-semibold rounded-2xl"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          ) : (
            <Button
              disabled
              size="lg"
              className="flex-1 h-14 text-lg font-semibold rounded-2xl"
            >
              Mission in Progress...
            </Button>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
