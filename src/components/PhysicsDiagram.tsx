import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PhysicsDiagramProps {
  type: 'inertia' | 'force' | 'action-reaction' | 'vacuum' | 'thrust' | 'rocket-equation' | 'gravity' | 'escape' | 'orbit';
  className?: string;
}

export function PhysicsDiagram({ type, className }: PhysicsDiagramProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div 
      className={cn(
        'relative bg-space-void rounded-xl p-4 overflow-hidden cursor-pointer',
        className
      )}
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {type === 'inertia' && <InertiaDiagram isPlaying={isPlaying} />}
      {type === 'force' && <ForceDiagram isPlaying={isPlaying} />}
      {type === 'action-reaction' && <ActionReactionDiagram isPlaying={isPlaying} />}
      {type === 'vacuum' && <VacuumDiagram isPlaying={isPlaying} />}
      {type === 'thrust' && <ThrustDiagram isPlaying={isPlaying} />}
      {type === 'rocket-equation' && <RocketEquationDiagram isPlaying={isPlaying} />}
      {type === 'gravity' && <GravityDiagram isPlaying={isPlaying} />}
      {type === 'escape' && <EscapeDiagram isPlaying={isPlaying} />}
      {type === 'orbit' && <OrbitDiagram isPlaying={isPlaying} />}
      
      <p className="text-[10px] text-muted-foreground text-center mt-2">
        {isPlaying ? 'Tap to pause' : 'Tap to play'}
      </p>
    </div>
  );
}

// Newton's First Law - Object in motion stays in motion
function InertiaDiagram({ isPlaying }: { isPlaying: boolean }) {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPosition(prev => (prev + 2) % 200);
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <svg viewBox="0 0 200 100" className="w-full h-24">
      {/* Stars background */}
      <circle cx="20" cy="20" r="1" fill="hsl(var(--foreground))" opacity="0.5" />
      <circle cx="80" cy="15" r="1" fill="hsl(var(--star-yellow))" opacity="0.7" />
      <circle cx="150" cy="30" r="1" fill="hsl(var(--foreground))" opacity="0.4" />
      <circle cx="180" cy="60" r="1" fill="hsl(var(--accent))" opacity="0.6" />
      
      {/* Moving ball in space */}
      <circle
        cx={position}
        cy="50"
        r="12"
        fill="hsl(var(--primary))"
        className="drop-shadow-lg"
      />
      
      {/* Velocity arrow */}
      <g transform={`translate(${position}, 50)`}>
        <line x1="15" y1="0" x2="35" y2="0" stroke="hsl(var(--accent))" strokeWidth="2" />
        <polygon points="35,-4 43,0 35,4" fill="hsl(var(--accent))" />
      </g>
      
      {/* Label */}
      <text x="100" y="90" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontWeight="500">
        No forces → Constant velocity
      </text>
    </svg>
  );
}

// Newton's Second Law - F = ma
function ForceDiagram({ isPlaying }: { isPlaying: boolean }) {
  const [position, setPosition] = useState(20);
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVelocity(prev => prev + 0.1); // Acceleration
      setPosition(prev => {
        const newPos = prev + velocity;
        if (newPos > 180) {
          setVelocity(0);
          return 20;
        }
        return newPos;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying, velocity]);

  return (
    <svg viewBox="0 0 200 100" className="w-full h-24">
      {/* Rocket with force arrow */}
      <g transform={`translate(${position}, 50)`}>
        {/* Force arrow (thrust) */}
        <line x1="-30" y1="0" x2="-10" y2="0" stroke="hsl(var(--rocket-flame))" strokeWidth="3" />
        <polygon points="-10,-5 0,0 -10,5" fill="hsl(var(--rocket-flame))" />
        
        {/* Rocket body */}
        <rect x="0" y="-8" width="20" height="16" fill="hsl(var(--muted))" rx="2" />
        <polygon points="20,-8 28,0 20,8" fill="hsl(var(--primary))" />
        
        {/* Flame */}
        {isPlaying && (
          <g className="animate-pulse">
            <ellipse cx="-5" cy="0" rx="8" ry="4" fill="hsl(var(--rocket-flame))" opacity="0.8" />
            <ellipse cx="-3" cy="0" rx="5" ry="2" fill="hsl(var(--star-yellow))" />
          </g>
        )}
      </g>
      
      {/* Formula */}
      <text x="100" y="20" textAnchor="middle" fill="hsl(var(--accent))" fontSize="12" fontWeight="bold">
        F = ma
      </text>
      
      {/* Acceleration indicator */}
      <text x="100" y="90" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8">
        More force → More acceleration
      </text>
    </svg>
  );
}

// Newton's Third Law - Action-Reaction
function ActionReactionDiagram({ isPlaying }: { isPlaying: boolean }) {
  const [exhaust, setExhaust] = useState<number[]>([]);
  const [rocketY, setRocketY] = useState(70);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      // Add exhaust particles
      setExhaust(prev => {
        const newParticles = [...prev, 0].map(p => p + 3);
        return newParticles.filter(p => p < 50);
      });
      // Rocket moves up as exhaust goes down
      setRocketY(prev => {
        if (prev <= 20) return 70;
        return prev - 0.5;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <svg viewBox="0 0 200 100" className="w-full h-24">
      {/* Action arrow (gas going down) */}
      <g transform="translate(100, 85)">
        <line x1="0" y1="-10" x2="0" y2="5" stroke="hsl(var(--rocket-flame))" strokeWidth="2" />
        <polygon points="-4,5 0,12 4,5" fill="hsl(var(--rocket-flame))" />
        <text x="20" y="5" fill="hsl(var(--rocket-flame))" fontSize="7">Action</text>
      </g>
      
      {/* Reaction arrow (rocket going up) */}
      <g transform={`translate(100, ${rocketY - 15})`}>
        <line x1="0" y1="10" x2="0" y2="-5" stroke="hsl(var(--accent))" strokeWidth="2" />
        <polygon points="-4,-5 0,-12 4,-5" fill="hsl(var(--accent))" />
        <text x="20" y="0" fill="hsl(var(--accent))" fontSize="7">Reaction</text>
      </g>
      
      {/* Rocket */}
      <g transform={`translate(100, ${rocketY})`}>
        <rect x="-8" y="-15" width="16" height="25" fill="hsl(var(--muted))" rx="3" />
        <polygon points="-8,-15 0,-25 8,-15" fill="hsl(var(--primary))" />
        
        {/* Exhaust particles */}
        {exhaust.map((y, i) => (
          <circle
            key={i}
            cx={Math.sin(i * 2) * 5}
            cy={10 + y}
            r={3 - y / 20}
            fill="hsl(var(--rocket-flame))"
            opacity={1 - y / 50}
          />
        ))}
      </g>
      
      <text x="100" y="15" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8">
        Equal & opposite forces
      </text>
    </svg>
  );
}

// Rockets work in vacuum
function VacuumDiagram({ isPlaying }: { isPlaying: boolean }) {
  const [particles, setParticles] = useState<{x: number, y: number, vx: number, vy: number}[]>([]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setParticles(prev => {
        // Add new particle
        const newParticle = {
          x: 85,
          y: 50,
          vx: -3 - Math.random() * 2,
          vy: (Math.random() - 0.5) * 2
        };
        // Move existing particles
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy
        })).filter(p => p.x > 0);
        
        return [...updated, newParticle].slice(-15);
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <svg viewBox="0 0 200 100" className="w-full h-24">
      {/* Space label */}
      <text x="30" y="20" fill="hsl(var(--muted-foreground))" fontSize="8">VACUUM</text>
      
      {/* Stars */}
      <circle cx="15" cy="40" r="1" fill="hsl(var(--foreground))" opacity="0.5" />
      <circle cx="45" cy="70" r="1" fill="hsl(var(--star-yellow))" opacity="0.6" />
      
      {/* Exhaust particles */}
      {particles.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={2}
          fill="hsl(var(--rocket-flame))"
          opacity={0.8 - (85 - p.x) / 100}
        />
      ))}
      
      {/* Rocket */}
      <g transform="translate(100, 50)">
        <rect x="-5" y="-10" width="25" height="20" fill="hsl(var(--muted))" rx="2" />
        <polygon points="20,-10 30,0 20,10" fill="hsl(var(--primary))" />
        <circle cx="5" cy="0" r="4" fill="hsl(var(--accent))" />
      </g>
      
      {/* Thrust arrow */}
      <g transform="translate(150, 50)">
        <line x1="0" y1="0" x2="25" y2="0" stroke="hsl(var(--accent))" strokeWidth="2" />
        <polygon points="25,-4 33,0 25,4" fill="hsl(var(--accent))" />
      </g>
      
      <text x="100" y="90" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8">
        Pushes against its own exhaust
      </text>
    </svg>
  );
}

// Thrust and propellant combustion
function ThrustDiagram({ isPlaying }: { isPlaying: boolean }) {
  const [combustionPhase, setCombustionPhase] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCombustionPhase(prev => (prev + 1) % 60);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <svg viewBox="0 0 200 100" className="w-full h-24">
      {/* Fuel tank */}
      <rect x="30" y="25" width="25" height="50" fill="hsl(var(--star-yellow))" rx="3" opacity="0.8" />
      <text x="42" y="55" textAnchor="middle" fill="hsl(var(--background))" fontSize="6" fontWeight="bold">FUEL</text>
      
      {/* Oxidizer tank */}
      <rect x="60" y="25" width="25" height="50" fill="hsl(var(--nebula-blue))" rx="3" opacity="0.8" />
      <text x="72" y="55" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="6" fontWeight="bold">O₂</text>
      
      {/* Combustion chamber */}
      <path d="M95 35 L120 35 L130 50 L120 65 L95 65 Z" fill="hsl(var(--muted))" />
      
      {/* Mixing animation */}
      <circle 
        cx={110} 
        cy={50} 
        r={8 + Math.sin(combustionPhase / 5) * 3}
        fill="hsl(var(--rocket-flame))"
        opacity={0.6 + Math.sin(combustionPhase / 5) * 0.3}
      />
      
      {/* Nozzle */}
      <path d="M130 40 L130 60 L160 75 L160 25 Z" fill="hsl(var(--muted))" />
      
      {/* Exhaust */}
      <g className={isPlaying ? 'animate-pulse' : ''}>
        <ellipse cx="175" cy="50" rx="20" ry="15" fill="hsl(var(--rocket-flame))" opacity="0.7" />
        <ellipse cx="170" cy="50" rx="12" ry="8" fill="hsl(var(--star-yellow))" />
      </g>
      
      {/* Flow arrows */}
      <path d="M55 50 L63 50" stroke="hsl(var(--star-yellow))" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <path d="M85 50 L93 50" stroke="hsl(var(--nebula-blue))" strokeWidth="2" />
      
      <text x="100" y="90" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8">
        Fuel + Oxygen → Hot expanding gas
      </text>
    </svg>
  );
}

// Rocket equation visualization
function RocketEquationDiagram({ isPlaying }: { isPlaying: boolean }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStage(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const fuelLevel = Math.max(0, 100 - stage * 2);
  const velocity = Math.min(100, stage * 2);

  return (
    <svg viewBox="0 0 200 100" className="w-full h-24">
      {/* Rocket with decreasing fuel */}
      <g transform="translate(40, 50)">
        <rect x="0" y="-15" width="15" height="30" fill="hsl(var(--muted))" rx="2" />
        <polygon points="15,-15 25,0 15,15" fill="hsl(var(--primary))" />
        
        {/* Fuel gauge */}
        <rect x="2" y={-13 + (26 * (1 - fuelLevel/100))} width="11" height={26 * fuelLevel/100} fill="hsl(var(--star-yellow))" rx="1" />
      </g>
      
      {/* Velocity bar */}
      <g transform="translate(80, 20)">
        <text x="0" y="0" fill="hsl(var(--foreground))" fontSize="7">Velocity</text>
        <rect x="0" y="5" width="100" height="10" fill="hsl(var(--muted))" rx="2" />
        <rect x="0" y="5" width={velocity} height="10" fill="hsl(var(--accent))" rx="2" />
      </g>
      
      {/* Mass bar */}
      <g transform="translate(80, 50)">
        <text x="0" y="0" fill="hsl(var(--foreground))" fontSize="7">Mass</text>
        <rect x="0" y="5" width="100" height="10" fill="hsl(var(--muted))" rx="2" />
        <rect x="0" y="5" width={30 + fuelLevel * 0.7} height="10" fill="hsl(var(--star-yellow))" rx="2" />
      </g>
      
      <text x="100" y="90" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8">
        Less mass = More acceleration
      </text>
    </svg>
  );
}

// Gravity pulling objects
function GravityDiagram({ isPlaying }: { isPlaying: boolean }) {
  const [ballY, setBallY] = useState(10);
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVelocity(prev => prev + 0.3); // Gravity acceleration
      setBallY(prev => {
        const newY = prev + velocity;
        if (newY > 65) {
          setVelocity(0);
          return 10;
        }
        return newY;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, velocity]);

  return (
    <svg viewBox="0 0 200 100" className="w-full h-24">
      {/* Earth */}
      <ellipse cx="100" cy="95" rx="80" ry="20" fill="hsl(var(--nebula-blue))" opacity="0.5" />
      <ellipse cx="100" cy="90" rx="70" ry="15" fill="hsl(var(--success))" opacity="0.6" />
      
      {/* Falling object */}
      <circle cx="100" cy={ballY} r="8" fill="hsl(var(--primary))" />
      
      {/* Gravity arrows */}
      {[60, 100, 140].map(x => (
        <g key={x} transform={`translate(${x}, ${ballY + 15})`}>
          <line x1="0" y1="0" x2="0" y2="15" stroke="hsl(var(--destructive))" strokeWidth="1.5" strokeDasharray="3,2" />
          <polygon points="-3,15 0,20 3,15" fill="hsl(var(--destructive))" />
        </g>
      ))}
      
      <text x="100" y="15" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8">
        g = 9.8 m/s²
      </text>
    </svg>
  );
}

// Escape velocity
function EscapeDiagram({ isPlaying }: { isPlaying: boolean }) {
  const [rocketPos, setRocketPos] = useState({ x: 50, y: 70 });
  const [escaped, setEscaped] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setRocketPos(prev => {
        const newY = prev.y - 2;
        const newX = prev.x + 1;
        if (newY < -10) {
          setEscaped(true);
          setTimeout(() => {
            setEscaped(false);
            setRocketPos({ x: 50, y: 70 });
          }, 500);
        }
        return { x: newX, y: newY };
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <svg viewBox="0 0 200 100" className="w-full h-24">
      {/* Earth */}
      <circle cx="30" cy="85" r="25" fill="hsl(var(--nebula-blue))" opacity="0.6" />
      <circle cx="30" cy="85" r="20" fill="hsl(var(--success))" opacity="0.5" />
      
      {/* Escape trajectory */}
      <path 
        d="M50 70 Q80 40 150 10" 
        fill="none" 
        stroke="hsl(var(--accent))" 
        strokeWidth="1" 
        strokeDasharray="4,4"
        opacity="0.5"
      />
      
      {/* Rocket */}
      {!escaped && (
        <g transform={`translate(${rocketPos.x}, ${rocketPos.y}) rotate(-45)`}>
          <rect x="-4" y="-8" width="8" height="16" fill="hsl(var(--muted))" rx="2" />
          <polygon points="-4,-8 0,-14 4,-8" fill="hsl(var(--primary))" />
          {isPlaying && (
            <ellipse cx="0" cy="12" rx="3" ry="6" fill="hsl(var(--rocket-flame))" className="animate-pulse" />
          )}
        </g>
      )}
      
      {/* Speed indicator */}
      <text x="150" y="30" fill="hsl(var(--accent))" fontSize="10" fontWeight="bold">
        11.2 km/s
      </text>
      
      <text x="100" y="90" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8">
        Escape velocity from Earth
      </text>
    </svg>
  );
}

// Orbital mechanics
function OrbitDiagram({ isPlaying }: { isPlaying: boolean }) {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAngle(prev => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const orbitRadius = 35;
  const satelliteX = 100 + Math.cos(angle * Math.PI / 180) * orbitRadius;
  const satelliteY = 50 + Math.sin(angle * Math.PI / 180) * orbitRadius;

  // Velocity is tangent to orbit
  const velocityAngle = angle + 90;
  const velX = Math.cos(velocityAngle * Math.PI / 180) * 15;
  const velY = Math.sin(velocityAngle * Math.PI / 180) * 15;

  return (
    <svg viewBox="0 0 200 100" className="w-full h-24">
      {/* Earth */}
      <circle cx="100" cy="50" r="18" fill="hsl(var(--nebula-blue))" />
      <circle cx="100" cy="50" r="15" fill="hsl(var(--success))" opacity="0.8" />
      
      {/* Orbit path */}
      <circle 
        cx="100" 
        cy="50" 
        r={orbitRadius} 
        fill="none" 
        stroke="hsl(var(--muted-foreground))" 
        strokeWidth="1" 
        strokeDasharray="4,4"
      />
      
      {/* Satellite */}
      <circle cx={satelliteX} cy={satelliteY} r="5" fill="hsl(var(--primary))" />
      
      {/* Velocity vector (tangent) */}
      <line 
        x1={satelliteX} 
        y1={satelliteY} 
        x2={satelliteX + velX} 
        y2={satelliteY + velY}
        stroke="hsl(var(--accent))"
        strokeWidth="2"
      />
      <circle cx={satelliteX + velX} cy={satelliteY + velY} r="2" fill="hsl(var(--accent))" />
      
      {/* Gravity vector (toward Earth) */}
      <line 
        x1={satelliteX} 
        y1={satelliteY} 
        x2={satelliteX + (100 - satelliteX) * 0.3} 
        y2={satelliteY + (50 - satelliteY) * 0.3}
        stroke="hsl(var(--destructive))"
        strokeWidth="1.5"
        strokeDasharray="3,2"
      />
      
      <text x="170" y="20" fill="hsl(var(--accent))" fontSize="7">velocity</text>
      <text x="170" y="80" fill="hsl(var(--destructive))" fontSize="7">gravity</text>
      
      <text x="100" y="95" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8">
        Falling around Earth forever
      </text>
    </svg>
  );
}
