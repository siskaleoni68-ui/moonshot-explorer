import { useState } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Atom, ArrowRight, Globe, Rocket, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Module {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  lessons: Lesson[];
  unlocked: boolean;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  content: string;
}

const modules: Module[] = [
  {
    id: 'newton',
    title: "Newton's Laws",
    subtitle: 'The foundation of rocket science',
    icon: Atom,
    color: 'primary',
    unlocked: true,
    lessons: [
      {
        id: 'n1',
        title: 'First Law: Inertia',
        duration: '3 min',
        completed: false,
        content: "An object at rest stays at rest, and an object in motion stays in motion — unless a force acts on it. In space, there's no air resistance, so rockets keep moving even after engines cut off!"
      },
      {
        id: 'n2',
        title: 'Second Law: F=ma',
        duration: '4 min',
        completed: false,
        content: "Force equals mass times acceleration. To accelerate a rocket, you need thrust (force). The less mass your rocket has, the faster it accelerates with the same thrust!"
      },
      {
        id: 'n3',
        title: 'Third Law: Action-Reaction',
        duration: '3 min',
        completed: false,
        content: "For every action, there's an equal and opposite reaction. Rockets push hot gas DOWN, and the gas pushes the rocket UP. This is how rockets work in the vacuum of space!"
      },
    ],
  },
  {
    id: 'space',
    title: 'Rockets in Space',
    subtitle: 'Why rockets work in vacuum',
    icon: Rocket,
    color: 'accent',
    unlocked: true,
    lessons: [
      {
        id: 's1',
        title: 'No Air, No Problem',
        duration: '3 min',
        completed: false,
        content: "Rockets don't push against air — they push against their own exhaust! The expelled gas creates thrust through Newton's Third Law, making rockets perfect for space travel."
      },
      {
        id: 's2',
        title: 'Thrust and Propellant',
        duration: '4 min',
        completed: false,
        content: "Rockets carry their own oxygen (oxidizer) mixed with fuel. When burned, hot gas expands and shoots out the nozzle at incredible speeds, creating thrust."
      },
      {
        id: 's3',
        title: 'The Rocket Equation',
        duration: '5 min',
        completed: false,
        content: "The Tsiolkovsky equation tells us: to go faster, we need more fuel, but more fuel means more mass to push. It's a tricky balance — that's why rockets have stages!"
      },
    ],
  },
  {
    id: 'gravity',
    title: 'Gravity & Escape',
    subtitle: 'Breaking free from Earth',
    icon: Globe,
    color: 'nebula-blue',
    unlocked: true,
    lessons: [
      {
        id: 'g1',
        title: 'What is Gravity?',
        duration: '3 min',
        completed: false,
        content: "Gravity is the force that pulls objects together. Earth's gravity pulls everything toward its center at 9.8 m/s². To escape, rockets must fight this constant pull."
      },
      {
        id: 'g2',
        title: 'Escape Velocity',
        duration: '4 min',
        completed: false,
        content: "To leave Earth forever, you need to reach 11.2 km/s (25,000 mph)! That's escape velocity — the speed needed to break free from Earth's gravitational pull."
      },
      {
        id: 'g3',
        title: 'Orbital Mechanics',
        duration: '5 min',
        completed: false,
        content: "To orbit Earth, go sideways fast enough (7.8 km/s) that as you fall, Earth curves away beneath you. You're always falling — but always missing the ground!"
      },
    ],
  },
  {
    id: 'failures',
    title: 'Why Missions Fail',
    subtitle: 'Learning from mistakes',
    icon: ArrowRight,
    color: 'destructive',
    unlocked: false,
    lessons: [
      {
        id: 'f1',
        title: 'Fuel Miscalculations',
        duration: '4 min',
        completed: false,
        content: "Running out of fuel mid-mission is catastrophic. Early Moon missions failed because engineers underestimated the fuel needed for landing and return."
      },
      {
        id: 'f2',
        title: 'Navigation Errors',
        duration: '4 min',
        completed: false,
        content: "Space is vast. A tiny navigation error can mean missing the Moon by thousands of kilometers. Precision is everything in orbital mechanics."
      },
      {
        id: 'f3',
        title: 'Landing Challenges',
        duration: '5 min',
        completed: false,
        content: "The Moon has no atmosphere for parachutes. Landers must use rockets to slow down, burning precious fuel. Many early missions crashed attempting this."
      },
    ],
  },
];

export default function LearnBasics() {
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = completedLessons.size;
  const progressPercent = (completedCount / totalLessons) * 100;

  const toggleLesson = (lessonId: string) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const markComplete = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-4 safe-area-pt">
        <h1 className="font-display text-2xl font-bold">Learn Basics</h1>
        <p className="text-sm text-muted-foreground mt-1">Master the fundamentals of rocket science</p>
        
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
          const moduleCompleted = module.lessons.filter(l => completedLessons.has(l.id)).length;
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
                )}>
                  <Icon className={cn(
                    'w-6 h-6',
                    module.color === 'primary' && 'text-primary',
                    module.color === 'accent' && 'text-accent',
                    module.color === 'nebula-blue' && 'text-nebula-blue',
                    module.color === 'destructive' && 'text-destructive',
                  )} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-semibold text-lg">{module.title}</h2>
                    {isModuleComplete && (
                      <Badge variant="secondary" className="bg-success/20 text-success">
                        <Check className="w-3 h-3 mr-1" />
                        Done
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{module.subtitle}</p>
                </div>
                {!module.unlocked && (
                  <Badge variant="outline" className="text-xs">Locked</Badge>
                )}
              </div>

              {/* Lessons accordion */}
              {module.unlocked && (
                <Accordion type="single" collapsible className="space-y-2">
                  {module.lessons.map((lesson) => {
                    const isComplete = completedLessons.has(lesson.id);
                    
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
  );
}
