import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RocketIcon } from '@/components/RocketIcon';
import { AudioControls } from '@/components/AudioControls';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useSound } from '@/hooks/useSound';
import { ChevronRight, Shield, Rocket, Moon, BookOpen, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';

const slides = [
  {
    id: 1,
    icon: Shield,
    title: 'Safety First',
    description: 'This app is for educational and simulation purposes only. It does NOT provide real-world rocket construction instructions.',
    isDisclaimer: true,
  },
  {
    id: 2,
    icon: BookOpen,
    title: 'Learn the Science',
    description: "Master Newton's Laws, orbital mechanics, and the physics that power real rockets — all explained simply.",
  },
  {
    id: 3,
    icon: FlaskConical,
    title: 'Build & Test',
    description: 'Design virtual rockets in our lab. Adjust thrust, mass, and fuel. Run simulations and see what works.',
  },
  {
    id: 4,
    icon: Moon,
    title: 'Reach the Moon',
    description: 'Apply everything you learn in an epic mission: Launch, orbit, transfer, and achieve a soft lunar landing.',
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const navigate = useNavigate();
  const { setOnboardingComplete, setDisclaimerAccepted } = useOnboardingStore();
  const { playSound, startMusic } = useSound();

  // Start background music on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      startMusic();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [startMusic]);

  const handleNext = useCallback(() => {
    playSound('whoosh');
    if (currentSlide === 0) {
      setDisclaimerAccepted();
    }
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide, setDisclaimerAccepted, playSound]);

  const handleComplete = useCallback(() => {
    playSound('launch');
    setOnboardingComplete();
    setTimeout(() => navigate('/learn'), 500);
  }, [setOnboardingComplete, navigate, playSound]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < slides.length - 1) {
        handleNext();
      } else if (diff < 0 && currentSlide > 0) {
        setCurrentSlide(prev => prev - 1);
      }
    }
    setTouchStart(null);
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div 
      className="min-h-screen space-bg stars-bg flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Audio controls */}
      <AudioControls className="absolute top-6 left-6 z-10" showVolumeControls />
      
      {/* Skip button */}
      {currentSlide > 0 && (
        <button
          onClick={handleComplete}
          className="absolute top-6 right-6 text-muted-foreground text-sm font-medium z-10"
        >
          Skip
        </button>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Icon/Rocket */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {currentSlide === 0 ? (
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center glow-primary">
              <Icon className="w-12 h-12 text-primary" />
            </div>
          ) : currentSlide === slides.length - 1 ? (
            <RocketIcon size={140} />
          ) : (
            <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center glow-accent">
              <Icon className="w-12 h-12 text-accent" />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 
          className="font-display text-3xl font-bold text-center mb-4 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          {slide.title}
        </h1>

        {/* Description */}
        <p 
          className={cn(
            "text-center max-w-sm leading-relaxed animate-fade-in",
            slide.isDisclaimer ? "text-primary font-medium" : "text-muted-foreground"
          )}
          style={{ animationDelay: '0.3s' }}
        >
          {slide.description}
        </p>

        {/* Disclaimer badge */}
        {slide.isDisclaimer && (
          <div className="mt-6 px-4 py-2 rounded-full border border-primary/50 bg-primary/10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <span className="text-xs font-medium text-primary">Educational Use Only</span>
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="px-6 pb-12 safe-area-pb">
        {/* Swipe indicators */}
        <div className="swipe-indicator mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => index <= currentSlide && setCurrentSlide(index)}
              className={cn('swipe-dot', index === currentSlide && 'active')}
            />
          ))}
        </div>

        {/* Action buttons */}
        {isLastSlide ? (
          <Button
            onClick={handleComplete}
            size="lg"
            className="w-full h-14 text-lg font-semibold rounded-2xl pulse-glow"
          >
            <Rocket className="w-5 h-5 mr-2" />
            Start Mission
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            size="lg"
            className={cn(
              "w-full h-14 text-lg font-semibold rounded-2xl",
              slide.isDisclaimer && "bg-primary"
            )}
          >
            {slide.isDisclaimer ? 'I Understand' : 'Continue'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        )}

        {/* Swipe hint */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Swipe left or right to navigate
        </p>
      </div>
    </div>
  );
}
