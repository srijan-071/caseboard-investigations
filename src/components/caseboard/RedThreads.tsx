import { useMemo } from 'react';
import { Task } from '@/types/task';

interface RedThreadsProps {
  tasks: Task[];
}

export default function RedThreads({ tasks }: RedThreadsProps) {
  const lines = useMemo(() => {
    if (tasks.length < 2) return [];
    const result: { x1: number; y1: number; x2: number; y2: number }[] = [];
    // Connect sequential tasks to create investigation wall look
    for (let i = 0; i < tasks.length - 1; i++) {
      const a = tasks[i];
      const b = tasks[i + 1];
      result.push({
        x1: a.position.x + 128,
        y1: a.position.y + 80,
        x2: b.position.x + 128,
        y2: b.position.y + 80,
      });
    }
    return result;
  }, [tasks]);

  if (lines.length === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ minHeight: '100%', minWidth: '100%' }}>
      {lines.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="hsl(0 75% 50%)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          opacity="0.5"
        />
      ))}
    </svg>
  );
}
