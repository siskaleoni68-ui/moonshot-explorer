import { useState } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AudioControls } from '@/components/AudioControls';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSound } from '@/hooks/useSound';
import { Info, Fuel, Gauge, Scale, Flame, CircleDot, Triangle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RocketPart {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  stats: { label: string; value: string }[];
  color: string;
}

const rocketParts: RocketPart[] = [
  {
    id: 'nose',
    name: 'Nose Cone',
    icon: Triangle,
    description: 'Aerodynamic tip that reduces drag during atmospheric flight. Shape affects how smoothly air flows around the rocket.',
    stats: [
      { label: 'Drag Reduction', value: '40%' },
      { label: 'Mass', value: '15 kg' },
    ],
    color: 'primary',
  },
  {
    id: 'payload',
    name: 'Payload Bay',
    icon: CircleDot,
    description: 'Where the mission equipment goes — satellites, scientific instruments, or crew capsules.',
    stats: [
      { label: 'Capacity', value: '500 kg' },
      { label: 'Volume', value: '2 m³' },
    ],
    color: 'accent',
  },
  {
    id: 'fuel',
    name: 'Fuel Tank',
    icon: Fuel,
    description: 'Stores liquid fuel (like RP-1 kerosene) that burns with oxidizer to create thrust.',
    stats: [
      { label: 'Capacity', value: '10,000 L' },
      { label: 'Mass (full)', value: '8,500 kg' },
    ],
    color: 'star',
  },
  {
    id: 'oxidizer',
    name: 'Oxidizer Tank',
    icon: Gauge,
    description: 'Contains liquid oxygen (LOX) — essential for combustion in the vacuum of space where there\'s no air.',
    stats: [
      { label: 'Capacity', value: '15,000 L' },
      { label: 'Temperature', value: '-183°C' },
    ],
    color: 'nebula-blue',
  },
  {
    id: 'engine',
    name: 'Rocket Engine',
    icon: Flame,
    description: 'The powerhouse! Mixes and ignites fuel with oxidizer, expelling hot gas at supersonic speeds.',
    stats: [
      { label: 'Thrust', value: '500 kN' },
      { label: 'ISP', value: '320 s' },
    ],
    color: 'rocket-flame',
  },
  {
    id: 'fins',
    name: 'Stabilizer Fins',
    icon: RotateCcw,
    description: 'Keep the rocket flying straight during atmospheric ascent. Not needed in space!',
    stats: [
      { label: 'Stability', value: '+25%' },
      { label: 'Mass', value: '30 kg' },
    ],
    color: 'muted-foreground',
  },
];

export default function RocketAnatomy() {
  const [selectedPart, setSelectedPart] = useState<RocketPart | null>(null);
  const [activeTab, setActiveTab] = useState('explore');
  const { playSound } = useSound();

  const selectPart = (part: RocketPart) => {
    playSound('click');
    setSelectedPart(part);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-4 safe-area-pt">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Rocket Anatomy</h1>
            <p className="text-sm text-muted-foreground mt-1">Tap parts to learn what they do</p>
          </div>
          <AudioControls showVolumeControls />
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={(tab) => { playSound('whoosh'); setActiveTab(tab); }} className="px-4 py-4">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="explore" className="text-sm font-medium">Explore Parts</TabsTrigger>
          <TabsTrigger value="diagram" className="text-sm font-medium">Full Diagram</TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="mt-4 space-y-6">
          {/* Interactive rocket visualization */}
          <div className="relative bg-gradient-to-b from-space-void to-background rounded-2xl p-6 min-h-[300px] flex items-center justify-center stars-bg">
            <svg
              width="120"
              height="280"
              viewBox="0 0 120 280"
              className="drop-shadow-2xl"
            >
              {/* Nose cone - clickable */}
              <g 
                onClick={() => selectPart(rocketParts[0])}
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <path
                  d="M60 0L40 50H80L60 0Z"
                  fill={selectedPart?.id === 'nose' ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="2"
                />
              </g>

              {/* Payload bay */}
              <g 
                onClick={() => selectPart(rocketParts[1])}
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <rect
                  x="40" y="50" width="40" height="40"
                  fill={selectedPart?.id === 'payload' ? 'hsl(var(--accent))' : 'hsl(var(--card))'}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="2"
                />
                <circle cx="60" cy="70" r="8" fill="hsl(var(--accent) / 0.5)" />
              </g>

              {/* Fuel tank */}
              <g 
                onClick={() => selectPart(rocketParts[2])}
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <rect
                  x="40" y="90" width="40" height="50"
                  fill={selectedPart?.id === 'fuel' ? 'hsl(var(--star-yellow))' : 'hsl(var(--secondary))'}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="2"
                  rx="4"
                />
                <text x="60" y="120" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">FUEL</text>
              </g>

              {/* Oxidizer tank */}
              <g 
                onClick={() => selectPart(rocketParts[3])}
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <rect
                  x="40" y="140" width="40" height="50"
                  fill={selectedPart?.id === 'oxidizer' ? 'hsl(var(--nebula-blue))' : 'hsl(var(--secondary))'}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="2"
                  rx="4"
                />
                <text x="60" y="170" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">LOX</text>
              </g>

              {/* Engine */}
              <g 
                onClick={() => selectPart(rocketParts[4])}
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <path
                  d="M40 190H80L90 230H30L40 190Z"
                  fill={selectedPart?.id === 'engine' ? 'hsl(var(--rocket-flame))' : 'hsl(var(--muted))'}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="2"
                />
              </g>

              {/* Fins */}
              <g 
                onClick={() => selectPart(rocketParts[5])}
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <path
                  d="M30 230L15 270L30 260V230Z"
                  fill={selectedPart?.id === 'fins' ? 'hsl(var(--foreground))' : 'hsl(var(--muted))'}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="1.5"
                />
                <path
                  d="M90 230L105 270L90 260V230Z"
                  fill={selectedPart?.id === 'fins' ? 'hsl(var(--foreground))' : 'hsl(var(--muted))'}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="1.5"
                />
              </g>

              {/* Flame animation */}
              <g className="animate-pulse">
                <path
                  d="M45 230C45 230 50 260 60 280C70 260 75 230 75 230"
                  fill="hsl(var(--rocket-flame))"
                />
                <path
                  d="M50 230C50 230 55 250 60 265C65 250 70 230 70 230"
                  fill="hsl(var(--star-yellow))"
                />
              </g>
            </svg>

            {/* Tap hint */}
            {!selectedPart && (
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-xs text-muted-foreground animate-pulse">Tap a rocket part to learn more</p>
              </div>
            )}
          </div>

          {/* Selected part info */}
          {selectedPart && (
            <Card className="p-5 animate-scale-in bg-card border-border">
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                  selectedPart.color === 'primary' && 'bg-primary/20',
                  selectedPart.color === 'accent' && 'bg-accent/20',
                  selectedPart.color === 'star' && 'bg-star/20',
                  selectedPart.color === 'nebula-blue' && 'bg-nebula-blue/20',
                  selectedPart.color === 'rocket-flame' && 'bg-rocket-flame/20',
                  selectedPart.color === 'muted-foreground' && 'bg-muted',
                )}>
                  <selectedPart.icon className={cn(
                    'w-6 h-6',
                    selectedPart.color === 'primary' && 'text-primary',
                    selectedPart.color === 'accent' && 'text-accent',
                    selectedPart.color === 'star' && 'text-star',
                    selectedPart.color === 'nebula-blue' && 'text-nebula-blue',
                    selectedPart.color === 'rocket-flame' && 'text-rocket-flame',
                    selectedPart.color === 'muted-foreground' && 'text-muted-foreground',
                  )} />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-lg">{selectedPart.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {selectedPart.description}
                  </p>
                  <div className="flex gap-2 mt-3">
                    {selectedPart.stats.map((stat) => (
                      <Badge key={stat.label} variant="secondary" className="text-xs">
                        {stat.label}: {stat.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Parts grid */}
          <div className="grid grid-cols-2 gap-3">
            {rocketParts.map((part) => {
              const Icon = part.icon;
              const isSelected = selectedPart?.id === part.id;

              return (
                <button
                  key={part.id}
                  onClick={() => selectPart(part)}
                  className={cn(
                    'touch-card text-left transition-all',
                    isSelected && 'ring-2 ring-primary bg-primary/10'
                  )}
                >
                  <Icon className={cn(
                    'w-5 h-5 mb-2',
                    part.color === 'primary' && 'text-primary',
                    part.color === 'accent' && 'text-accent',
                    part.color === 'star' && 'text-star',
                    part.color === 'nebula-blue' && 'text-nebula-blue',
                    part.color === 'rocket-flame' && 'text-rocket-flame',
                    part.color === 'muted-foreground' && 'text-muted-foreground',
                  )} />
                  <p className="font-medium text-sm">{part.name}</p>
                </button>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="diagram" className="mt-4">
          <Card className="p-6 bg-gradient-to-b from-space-void to-card">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-accent" />
              <p className="text-sm text-muted-foreground">Complete rocket schematic</p>
            </div>
            
            {/* Full labeled diagram */}
            <div className="relative flex justify-center py-8">
              <svg width="200" height="400" viewBox="0 0 200 400">
                {/* Rocket body */}
                <path d="M100 10L70 60H130L100 10Z" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <rect x="70" y="60" width="60" height="50" fill="hsl(var(--card))" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <rect x="70" y="110" width="60" height="70" fill="hsl(var(--secondary))" stroke="hsl(var(--foreground))" strokeWidth="2" rx="4" />
                <rect x="70" y="180" width="60" height="70" fill="hsl(var(--secondary))" stroke="hsl(var(--foreground))" strokeWidth="2" rx="4" />
                <path d="M70 250H130L150 310H50L70 250Z" fill="hsl(var(--muted))" stroke="hsl(var(--foreground))" strokeWidth="2" />
                
                {/* Fins */}
                <path d="M50 310L25 370L50 350V310Z" fill="hsl(var(--muted))" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
                <path d="M150 310L175 370L150 350V310Z" fill="hsl(var(--muted))" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
                
                {/* Labels */}
                <text x="160" y="30" fill="hsl(var(--foreground))" fontSize="10">Nose Cone</text>
                <line x1="130" y1="35" x2="155" y2="30" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                
                <text x="160" y="85" fill="hsl(var(--foreground))" fontSize="10">Payload</text>
                <line x1="130" y1="85" x2="155" y2="85" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                
                <text x="160" y="145" fill="hsl(var(--foreground))" fontSize="10">Fuel Tank</text>
                <line x1="130" y1="145" x2="155" y2="145" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                
                <text x="160" y="215" fill="hsl(var(--foreground))" fontSize="10">LOX Tank</text>
                <line x1="130" y1="215" x2="155" y2="215" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                
                <text x="160" y="280" fill="hsl(var(--foreground))" fontSize="10">Engine</text>
                <line x1="150" y1="280" x2="155" y2="280" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                
                <text x="165" y="340" fill="hsl(var(--foreground))" fontSize="10">Fins</text>
                <line x1="150" y1="340" x2="160" y2="340" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />

                {/* Flame */}
                <g className="animate-pulse">
                  <path d="M80 310C80 310 90 360 100 390C110 360 120 310 120 310" fill="hsl(var(--rocket-flame))" />
                  <path d="M88 310C88 310 95 345 100 370C105 345 112 310 112 310" fill="hsl(var(--star-yellow))" />
                </g>
              </svg>
            </div>

            <div className="mt-4 p-4 bg-muted/30 rounded-xl">
              <h4 className="font-display font-semibold mb-2">Quick Facts</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Most of a rocket's mass is fuel & oxidizer</li>
                <li>• Staging drops empty tanks to save weight</li>
                <li>• Fins only work in atmosphere, not space</li>
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <BottomNavigation />
    </div>
  );
}
