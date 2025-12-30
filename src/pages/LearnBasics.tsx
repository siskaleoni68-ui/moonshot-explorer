import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { PhysicsDiagram } from '@/components/PhysicsDiagram';
import { AudioControls } from '@/components/AudioControls';
import { UnlockCelebration } from '@/components/UnlockCelebration';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSound } from '@/hooks/useSound';
import { useProgressStore } from '@/stores/progressStore';
import { ChevronRight, Atom, ArrowRight, Globe, Rocket, Check, Moon, Zap, Target, Cpu, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
  diagram?: 'inertia' | 'force' | 'action-reaction' | 'vacuum' | 'thrust' | 'rocket-equation' | 'gravity' | 'escape' | 'orbit';
}

interface ModuleData {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  lessons: Lesson[];
  requiredModuleId?: string; // Module that must be completed to unlock this one
}

const modulesData: ModuleData[] = [
  {
    id: 'newton',
    title: "Newton's Laws",
    subtitle: 'The foundation of rocket science',
    icon: Atom,
    color: 'primary',
    lessons: [
      {
        id: 'n1',
        title: 'First Law: Inertia',
        duration: '3 min',
        content: "An object at rest stays at rest, and an object in motion stays in motion — unless a force acts on it. In space, there's no air resistance, so rockets keep moving even after engines cut off!",
        diagram: 'inertia',
      },
      {
        id: 'n2',
        title: 'Second Law: F=ma',
        duration: '4 min',
        content: "Force equals mass times acceleration. To accelerate a rocket, you need thrust (force). The less mass your rocket has, the faster it accelerates with the same thrust!",
        diagram: 'force',
      },
      {
        id: 'n3',
        title: 'Third Law: Action-Reaction',
        duration: '3 min',
        content: "For every action, there's an equal and opposite reaction. Rockets push hot gas DOWN, and the gas pushes the rocket UP. This is how rockets work in the vacuum of space!",
        diagram: 'action-reaction',
      },
    ],
  },
  {
    id: 'space',
    title: 'Rockets in Space',
    subtitle: 'Why rockets work in vacuum',
    icon: Rocket,
    color: 'accent',
    requiredModuleId: 'newton',
    lessons: [
      {
        id: 's1',
        title: 'No Air, No Problem',
        duration: '3 min',
        content: "Rockets don't push against air — they push against their own exhaust! The expelled gas creates thrust through Newton's Third Law, making rockets perfect for space travel.",
        diagram: 'vacuum',
      },
      {
        id: 's2',
        title: 'Thrust and Propellant',
        duration: '4 min',
        content: "Rockets carry their own oxygen (oxidizer) mixed with fuel. When burned, hot gas expands and shoots out the nozzle at incredible speeds, creating thrust.",
        diagram: 'thrust',
      },
      {
        id: 's3',
        title: 'The Rocket Equation',
        duration: '5 min',
        content: "The Tsiolkovsky equation tells us: to go faster, we need more fuel, but more fuel means more mass to push. It's a tricky balance — that's why rockets have stages!",
        diagram: 'rocket-equation',
      },
    ],
  },
  {
    id: 'gravity',
    title: 'Gravity & Escape',
    subtitle: 'Breaking free from Earth',
    icon: Globe,
    color: 'nebula-blue',
    requiredModuleId: 'space',
    lessons: [
      {
        id: 'g1',
        title: 'What is Gravity?',
        duration: '3 min',
        content: "Gravity is the force that pulls objects together. Earth's gravity pulls everything toward its center at 9.8 m/s². To escape, rockets must fight this constant pull.",
        diagram: 'gravity',
      },
      {
        id: 'g2',
        title: 'Escape Velocity',
        duration: '4 min',
        content: "To leave Earth forever, you need to reach 11.2 km/s (25,000 mph)! That's escape velocity — the speed needed to break free from Earth's gravitational pull.",
        diagram: 'escape',
      },
      {
        id: 'g3',
        title: 'Orbital Mechanics',
        duration: '5 min',
        content: "To orbit Earth, go sideways fast enough (7.8 km/s) that as you fall, Earth curves away beneath you. You're always falling — but always missing the ground!",
        diagram: 'orbit',
      },
    ],
  },
  {
    id: 'failures',
    title: 'Why Missions Fail',
    subtitle: 'Learning from mistakes',
    icon: ArrowRight,
    color: 'destructive',
    requiredModuleId: 'gravity',
    lessons: [
      {
        id: 'f1',
        title: 'Fuel Miscalculations',
        duration: '4 min',
        content: "Running out of fuel mid-mission is catastrophic. Early Moon missions failed because engineers underestimated the fuel needed for landing and return."
      },
      {
        id: 'f2',
        title: 'Navigation Errors',
        duration: '4 min',
        content: "Space is vast. A tiny navigation error can mean missing the Moon by thousands of kilometers. Precision is everything in orbital mechanics."
      },
      {
        id: 'f3',
        title: 'Landing Challenges',
        duration: '5 min',
        content: "The Moon has no atmosphere for parachutes. Landers must use rockets to slow down, burning precious fuel. Many early missions crashed attempting this."
      },
    ],
  },
  {
    id: 'staging',
    title: 'Rocket Staging',
    subtitle: 'Shedding weight to go faster',
    icon: Zap,
    color: 'star',
    requiredModuleId: 'failures',
    lessons: [
      {
        id: 'st1',
        title: 'Why Use Stages?',
        duration: '4 min',
        content: "Empty fuel tanks are dead weight. By dropping used stages, rockets become lighter and accelerate faster. Saturn V used 3 stages to reach the Moon!"
      },
      {
        id: 'st2',
        title: 'Stage Separation',
        duration: '3 min',
        content: "Explosive bolts and separation motors push stages apart in milliseconds. If this fails, the mission is over. Timing must be perfect."
      },
      {
        id: 'st3',
        title: 'Optimal Staging',
        duration: '5 min',
        content: "Engineers calculate exactly when to drop each stage for maximum efficiency. Too early = wasted fuel. Too late = carrying dead weight."
      },
    ],
  },
  {
    id: 'navigation',
    title: 'Space Navigation',
    subtitle: 'Finding your way in the void',
    icon: Target,
    color: 'success',
    requiredModuleId: 'staging',
    lessons: [
      {
        id: 'nav1',
        title: 'Star Tracking',
        duration: '4 min',
        content: "In space, there's no GPS. Spacecraft navigate by tracking stars with precise instruments. The stars never move — they're the ultimate reference points."
      },
      {
        id: 'nav2',
        title: 'Trajectory Planning',
        duration: '5 min',
        content: "To reach the Moon, you don't aim at it — you aim at where it WILL BE in 3 days. This requires complex calculations accounting for gravity from Earth, Moon, and Sun."
      },
      {
        id: 'nav3',
        title: 'Mid-Course Corrections',
        duration: '4 min',
        content: "Small engine burns adjust the trajectory during flight. Even tiny errors compound over vast distances, so corrections are essential for precision."
      },
    ],
  },
  {
    id: 'lunar',
    title: 'Lunar Operations',
    subtitle: 'Surviving on the Moon',
    icon: Moon,
    color: 'muted',
    requiredModuleId: 'navigation',
    lessons: [
      {
        id: 'lu1',
        title: 'Lunar Descent',
        duration: '5 min',
        content: "Landing on the Moon is the most dangerous phase. With no atmosphere, you must use rockets to slow from 6,000 km/h to zero — while fuel runs out."
      },
      {
        id: 'lu2',
        title: 'Surface Operations',
        duration: '4 min',
        content: "The Moon has 1/6 Earth's gravity, extreme temperature swings, and deadly radiation. Every EVA must be carefully planned for astronaut survival."
      },
      {
        id: 'lu3',
        title: 'Lunar Ascent',
        duration: '4 min',
        content: "Returning home means launching from the Moon's surface. The ascent module must work perfectly on the first try — there's no rescue mission possible."
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Mission Control',
    subtitle: 'The brains behind the mission',
    icon: Cpu,
    color: 'primary',
    requiredModuleId: 'lunar',
    lessons: [
      {
        id: 'adv1',
        title: 'Communication Delays',
        duration: '4 min',
        content: "Radio signals take 1.3 seconds to reach the Moon. Mission Control must anticipate problems, as real-time control is impossible at these distances."
      },
      {
        id: 'adv2',
        title: 'Abort Scenarios',
        duration: '5 min',
        content: "Every mission has multiple abort modes: return to launch site, emergency orbit, or lunar flyby return. Crews train extensively for every scenario."
      },
      {
        id: 'adv3',
        title: 'Redundancy & Backup',
        duration: '4 min',
        content: "Critical systems have backups for their backups. Apollo 13 survived because redundant systems allowed creative problem-solving when primary systems failed."
      },
    ],
  },
];

export default function LearnBasics() {
  const { completedLessons, addCompletedLesson, isLessonCompleted } = useProgressStore();
  const { playSound } = useSound();
  
  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false);
  const [unlockedModuleName, setUnlockedModuleName] = useState('');
  const previousUnlockedRef = useRef<Set<string>>(new Set());

  // Helper to check if a module is completed
  const isModuleCompleted = useCallback((moduleId: string) => {
    const moduleData = modulesData.find(m => m.id === moduleId);
    if (!moduleData) return false;
    return moduleData.lessons.every(lesson => completedLessons.includes(lesson.id));
  }, [completedLessons]);

  // Calculate which modules are unlocked based on completion
  const modules = useMemo(() => {
    return modulesData.map(module => ({
      ...module,
      unlocked: !module.requiredModuleId || isModuleCompleted(module.requiredModuleId),
    }));
  }, [isModuleCompleted]);

  // Detect newly unlocked modules
  useEffect(() => {
    const currentUnlocked = new Set(modules.filter(m => m.unlocked).map(m => m.id));
    const previousUnlocked = previousUnlockedRef.current;
    
    // Find newly unlocked modules (not in previous, but in current)
    const newlyUnlocked = modules.find(m => 
      m.unlocked && 
      !previousUnlocked.has(m.id) && 
      m.requiredModuleId // Only celebrate unlocks that required completion
    );
    
    if (newlyUnlocked && previousUnlocked.size > 0) {
      setUnlockedModuleName(newlyUnlocked.title);
      setShowCelebration(true);
      playSound('unlock');
    }
    
    previousUnlockedRef.current = currentUnlocked;
  }, [modules, playSound]);

  const totalLessons = modulesData.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = completedLessons.length;
  const progressPercent = (completedCount / totalLessons) * 100;

  const markComplete = (lessonId: string) => {
    playSound('complete');
    addCompletedLesson(lessonId);
  };

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
  }, []);

  return (
    <>
      {/* Unlock celebration overlay */}
      <UnlockCelebration 
        show={showCelebration} 
        moduleName={unlockedModuleName} 
        onComplete={handleCelebrationComplete} 
      />
      
      <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-4 safe-area-pt">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Learn Basics</h1>
            <p className="text-sm text-muted-foreground mt-1">Master the fundamentals of rocket science</p>
          </div>
          <AudioControls showVolumeControls />
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-3">
          <Progress value={progressPercent} className="flex-1 h-2" />
          <span className="text-xs font-medium text-muted-foreground">
            {completedCount}/{totalLessons}
          </span>
        </div>
      </header>

      {/* Modules */}
      <main className="px-4 py-6 space-y-4">
        {modules.map((module, moduleIndex) => {
          const Icon = module.icon;
          const moduleCompleted = module.lessons.filter(l => isLessonCompleted(l.id)).length;
          const isModuleComplete = moduleCompleted === module.lessons.length;

          return (
            <div
              key={module.id}
              className={cn(
                'module-card animate-fade-in',
                !module.unlocked && 'opacity-50'
              )}
              style={{ animationDelay: `${moduleIndex * 0.1}s` }}
            >
              {/* Module header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  module.color === 'primary' && 'bg-primary/20',
                  module.color === 'accent' && 'bg-accent/20',
                  module.color === 'nebula-blue' && 'bg-nebula-blue/20',
                  module.color === 'destructive' && 'bg-destructive/20',
                  module.color === 'star' && 'bg-star/20',
                  module.color === 'success' && 'bg-success/20',
                  module.color === 'muted' && 'bg-muted-foreground/20',
                  !module.unlocked && 'opacity-50',
                )}>
                  {module.unlocked ? (
                    <Icon className={cn(
                      'w-6 h-6',
                      module.color === 'primary' && 'text-primary',
                      module.color === 'accent' && 'text-accent',
                      module.color === 'nebula-blue' && 'text-nebula-blue',
                      module.color === 'destructive' && 'text-destructive',
                      module.color === 'star' && 'text-star',
                      module.color === 'success' && 'text-success',
                      module.color === 'muted' && 'text-muted-foreground',
                    )} />
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className={cn(
                      "font-display font-semibold text-lg",
                      !module.unlocked && "text-muted-foreground"
                    )}>{module.title}</h2>
                    {isModuleComplete && module.unlocked && (
                      <Badge variant="secondary" className="bg-success/20 text-success">
                        <Check className="w-3 h-3 mr-1" />
                        Done
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{module.subtitle}</p>
                  {!module.unlocked && module.requiredModuleId && (
                    <p className="text-xs text-muted-foreground/70 mt-1 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Complete "{modulesData.find(m => m.id === module.requiredModuleId)?.title}" to unlock
                    </p>
                  )}
                </div>
                {!module.unlocked && (
                  <Badge variant="outline" className="text-xs border-muted-foreground/30">
                    <Lock className="w-3 h-3 mr-1" />
                    Locked
                  </Badge>
                )}
              </div>

              {/* Lessons accordion */}
              {module.unlocked && (
                <Accordion type="single" collapsible className="space-y-2">
                  {module.lessons.map((lesson) => {
                    const isComplete = isLessonCompleted(lesson.id);
                    
                    return (
                      <AccordionItem
                        key={lesson.id}
                        value={lesson.id}
                        className="border-0"
                      >
                        <AccordionTrigger className="hover:no-underline py-3 px-4 bg-muted/30 rounded-xl data-[state=open]:rounded-b-none">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={cn(
                              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                              isComplete 
                                ? 'bg-success border-success' 
                                : 'border-muted-foreground/30'
                            )}>
                              {isComplete && <Check className="w-3 h-3 text-success-foreground" />}
                            </div>
                            <span className={cn(
                              'font-medium text-left',
                              isComplete && 'text-muted-foreground'
                            )}>
                              {lesson.title}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground mr-2">{lesson.duration}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-2 bg-muted/30 rounded-b-xl">
                          {/* Animated diagram */}
                          {lesson.diagram && (
                            <PhysicsDiagram type={lesson.diagram} className="mb-4" />
                          )}
                          
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            {lesson.content}
                          </p>
                          {!isComplete && (
                            <button
                              onClick={() => markComplete(lesson.id)}
                              className="text-sm font-medium text-primary flex items-center gap-1 active:scale-95 transition-transform"
                            >
                              Mark as Complete
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>
          );
        })}
      </main>

      <BottomNavigation />
    </div>
    </>
  );
}
