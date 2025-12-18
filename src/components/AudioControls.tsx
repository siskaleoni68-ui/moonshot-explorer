import { Volume2, VolumeX, Music } from 'lucide-react';
import { useAudioStore } from '@/stores/audioStore';
import { useSound } from '@/hooks/useSound';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface AudioControlsProps {
  className?: string;
  showVolumeControls?: boolean;
}

export function AudioControls({ className, showVolumeControls = false }: AudioControlsProps) {
  const { isMuted, toggleMute, musicVolume, sfxVolume, setMusicVolume, setSfxVolume } = useAudioStore();
  const { playSound, startMusic, stopMusic } = useSound();

  const handleToggleMute = () => {
    toggleMute();
    if (!isMuted) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  if (!showVolumeControls) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleMute}
        className={cn(
          'w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border/50',
          className
        )}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Volume2 className="w-5 h-5 text-primary" />
        )}
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border/50',
            className
          )}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Volume2 className="w-5 h-5 text-primary" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sound</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleMute}
              className="h-8 px-2"
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Music</span>
              </div>
              <Slider
                value={[musicVolume * 100]}
                onValueChange={([value]) => setMusicVolume(value / 100)}
                max={100}
                step={5}
                disabled={isMuted}
                className="touch-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Effects</span>
              </div>
              <Slider
                value={[sfxVolume * 100]}
                onValueChange={([value]) => {
                  setSfxVolume(value / 100);
                  playSound('click');
                }}
                max={100}
                step={5}
                disabled={isMuted}
                className="touch-none"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
