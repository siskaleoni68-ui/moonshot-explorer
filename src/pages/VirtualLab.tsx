import { useState, useCallback } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AudioControls } from '@/components/AudioControls';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSound } from '@/hooks/useSound';
import { useProgressStore } from '@/stores/progressStore';
import { Play, RotateCcw, AlertTriangle, CheckCircle, Flame, Scale, Gauge, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SimulationResult {
  success: boolean;
  maxAltitude: number;
  status: string;
  details: string;
}

export default function VirtualLab() {
  const [thrust, setThrust] = useState([300]);
  const [fuelMass, setFuelMass] = useState([5000]);
  const [payloadMass, setPayloadMass] = useState([200]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const { playSound } = useSound();
  const { incrementSimulation, simulationCount, successfulLaunches, bestAltitude } = useProgressStore();

  const totalMass = fuelMass[0] + payloadMass[0] + 500; // +500 for rocket structure
  const thrustToWeightRatio = (thrust[0] * 1000) / (totalMass * 9.8);
  const deltaV = 320 * 9.8 * Math.log(totalMass / (totalMass - fuelMass[0] * 0.9)); // Simplified rocket equation

  const runSimulation = useCallback(() => {
    setIsSimulating(true);
    setResult(null);
    setSimulationProgress(0);
    playSound('launch');

    // Simulate progress
    const progressInterval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // Calculate result after simulation
    setTimeout(() => {
      clearInterval(progressInterval);
      setSimulationProgress(100);
      
      let simResult: SimulationResult;

      if (thrustToWeightRatio < 1) {
        simResult = {
          success: false,
          maxAltitude: 0,
          status: 'Launch Failure',
          details: 'Thrust-to-weight ratio below 1! Rocket cannot lift off. Increase thrust or reduce mass.',
        };
      } else if (deltaV < 2000) {
        simResult = {
          success: false,
          maxAltitude: Math.round(deltaV * 5),
          status: 'Insufficient Velocity',
          details: 'Not enough delta-v to reach orbit. Add more fuel or reduce payload.',
        };
      } else if (deltaV < 9000) {
        const altitude = Math.round((deltaV / 9000) * 400);
        simResult = {
          success: false,
          maxAltitude: altitude,
          status: 'Partial Success',
          details: `Reached ${altitude}km but couldn't achieve orbit. Need more delta-v!`,
        };
      } else {
        simResult = {
          success: true,
          maxAltitude: 400,
          status: 'Orbit Achieved!',
          details: 'Congratulations! Your rocket reached stable Low Earth Orbit at 400km.',
        };
      }

      setResult(simResult);
      setIsSimulating(false);
      incrementSimulation(simResult.success, simResult.maxAltitude);

      if (simResult.success) {
        playSound('success');
        toast.success('Mission Success!', { description: simResult.details });
      } else {
        playSound('error');
        toast.error(simResult.status, { description: simResult.details });
      }
    }, 2500);
  }, [thrustToWeightRatio, deltaV, playSound, incrementSimulation]);

  const resetSimulation = () => {
    setThrust([300]);
    setFuelMass([5000]);
    setPayloadMass([200]);
    setResult(null);
    setSimulationProgress(0);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-4 safe-area-pt">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Virtual Lab</h1>
            <p className="text-sm text-muted-foreground mt-1">Build and test your rocket design</p>
          </div>
          <AudioControls showVolumeControls />
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Rocket preview */}
        <Card className="p-6 bg-gradient-to-b from-space-void to-card relative overflow-hidden">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className={cn(
              'transition-transform duration-500',
              isSimulating && 'animate-bounce'
            )}>
              <svg width="80" height="180" viewBox="0 0 80 180">
                {/* Rocket scales with payload */}
                <path d="M40 0L25 30H55L40 0Z" fill="hsl(var(--primary))" />
                <rect x="25" y="30" width="30" height={20 + payloadMass[0] / 50} fill="hsl(var(--accent))" />
                <rect x="25" y={50 + payloadMass[0] / 50} width="30" height={40 + fuelMass[0] / 200} fill="hsl(var(--secondary))" rx="3" />
                <path 
                  d={`M25 ${90 + payloadMass[0] / 50 + fuelMass[0] / 200}H55L65 ${120 + payloadMass[0] / 50 + fuelMass[0] / 200}H15L25 ${90 + payloadMass[0] / 50 + fuelMass[0] / 200}Z`}
                  fill="hsl(var(--muted))" 
                />
                {/* Dynamic flame based on thrust */}
                {isSimulating && (
                  <g className="animate-pulse">
                    <path
                      d={`M30 ${120 + payloadMass[0] / 50 + fuelMass[0] / 200}C30 ${120 + payloadMass[0] / 50 + fuelMass[0] / 200} 35 ${150 + thrust[0] / 10} 40 ${170 + thrust[0] / 8}C45 ${150 + thrust[0] / 10} 50 ${120 + payloadMass[0] / 50 + fuelMass[0] / 200} 50 ${120 + payloadMass[0] / 50 + fuelMass[0] / 200}`}
                      fill="hsl(var(--rocket-flame))"
                    />
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Simulation progress */}
          {isSimulating && (
            <div className="mt-4">
              <Progress value={simulationProgress} className="h-2" />
              <p className="text-center text-sm text-muted-foreground mt-2">
                Simulating launch... {simulationProgress}%
              </p>
            </div>
          )}

          {/* Stars background */}
          <div className="absolute inset-0 stars-bg opacity-50 pointer-events-none" />
        </Card>

        {/* Controls */}
        <div className="space-y-5">
          {/* Thrust slider */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rocket-flame" />
                <span className="font-medium">Thrust</span>
              </div>
              <Badge variant="secondary">{thrust[0]} kN</Badge>
            </div>
            <Slider
              value={thrust}
              onValueChange={setThrust}
              min={100}
              max={800}
              step={10}
              disabled={isSimulating}
              className="touch-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Force pushing the rocket upward
            </p>
          </Card>

          {/* Fuel mass slider */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-star" />
                <span className="font-medium">Fuel Mass</span>
              </div>
              <Badge variant="secondary">{fuelMass[0].toLocaleString()} kg</Badge>
            </div>
            <Slider
              value={fuelMass}
              onValueChange={setFuelMass}
              min={1000}
              max={15000}
              step={500}
              disabled={isSimulating}
              className="touch-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              More fuel = more delta-v, but heavier
            </p>
          </Card>

          {/* Payload mass slider */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-accent" />
                <span className="font-medium">Payload Mass</span>
              </div>
              <Badge variant="secondary">{payloadMass[0]} kg</Badge>
            </div>
            <Slider
              value={payloadMass}
              onValueChange={setPayloadMass}
              min={50}
              max={1000}
              step={50}
              disabled={isSimulating}
              className="touch-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              What you're trying to get to space
            </p>
          </Card>
        </div>

        {/* Stats panel */}
        <Card className="p-5 bg-muted/30">
          <h3 className="font-display font-semibold mb-3">Rocket Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Mass</p>
              <p className="font-semibold">{totalMass.toLocaleString()} kg</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">TWR</p>
              <p className={cn(
                'font-semibold',
                thrustToWeightRatio < 1 && 'text-destructive',
                thrustToWeightRatio >= 1 && thrustToWeightRatio < 1.5 && 'text-star',
                thrustToWeightRatio >= 1.5 && 'text-success'
              )}>
                {thrustToWeightRatio.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Delta-V</p>
              <p className={cn(
                'font-semibold',
                deltaV < 2000 && 'text-destructive',
                deltaV >= 2000 && deltaV < 9000 && 'text-star',
                deltaV >= 9000 && 'text-success'
              )}>
                {Math.round(deltaV).toLocaleString()} m/s
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Orbit Needs</p>
              <p className="font-semibold text-muted-foreground">~9,000 m/s</p>
            </div>
          </div>
        </Card>

        {/* Career Stats */}
        {simulationCount > 0 && (
          <Card className="p-5 bg-primary/5 border-primary/20">
            <h3 className="font-display font-semibold mb-3">Your Career Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{simulationCount}</p>
                <p className="text-xs text-muted-foreground">Launches</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{successfulLaunches}</p>
                <p className="text-xs text-muted-foreground">Successes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">{bestAltitude}</p>
                <p className="text-xs text-muted-foreground">Best Alt (km)</p>
              </div>
            </div>
          </Card>
        )}

        {/* Result panel */}
        {result && (
          <Card className={cn(
            'p-5 animate-scale-in',
            result.success ? 'bg-success/10 border-success/50' : 'bg-destructive/10 border-destructive/50'
          )}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle className="w-6 h-6 text-success shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-destructive shrink-0" />
              )}
              <div>
                <h3 className="font-display font-semibold">{result.status}</h3>
                <p className="text-sm text-muted-foreground mt-1">{result.details}</p>
                {result.maxAltitude > 0 && (
                  <p className="text-sm mt-2">
                    Max Altitude: <span className="font-semibold">{result.maxAltitude} km</span>
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={runSimulation}
            disabled={isSimulating}
            size="lg"
            className="flex-1 h-14 text-lg font-semibold rounded-2xl"
          >
            <Play className="w-5 h-5 mr-2" />
            {isSimulating ? 'Simulating...' : 'Launch Simulation'}
          </Button>
          <Button
            onClick={resetSimulation}
            variant="outline"
            size="lg"
            className="h-14 px-4 rounded-2xl"
            disabled={isSimulating}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
