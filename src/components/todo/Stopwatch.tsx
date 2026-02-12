import { useState, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (running) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTime(prev => prev + 10);
    }, 10);
  }, [running]);

  const pause = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTime(0);
  }, []);

  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const ms = Math.floor((time % 1000) / 10);

  const pad = (n: number, len = 2) => String(n).padStart(len, '0');

  return (
    <div className="flex items-center gap-2 bg-card border border-border rounded px-3 py-2 polaroid-shadow">
      <div className="font-mono-timer text-base font-bold text-foreground tracking-wider tabular-nums">
        {hours > 0 && <span>{pad(hours)}:</span>}
        <span>{pad(minutes)}</span>
        <span className="text-muted-foreground">:</span>
        <span>{pad(seconds)}</span>
        <span className="text-muted-foreground text-xs">.{pad(ms)}</span>
      </div>
      <div className="flex gap-0.5">
        {!running ? (
          <Button size="icon" variant="ghost" onClick={start} className="h-7 w-7 text-primary hover:bg-secondary">
            <Play className="w-3.5 h-3.5" />
          </Button>
        ) : (
          <Button size="icon" variant="ghost" onClick={pause} className="h-7 w-7 text-accent hover:bg-secondary">
            <Pause className="w-3.5 h-3.5" />
          </Button>
        )}
        <Button size="icon" variant="ghost" onClick={reset} className="h-7 w-7 text-muted-foreground hover:bg-secondary">
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
