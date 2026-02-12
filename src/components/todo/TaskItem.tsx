import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2, Clock, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const priorityConfig = {
  high: { label: 'HIGH', badgeClass: 'bg-red-900/60 text-red-300', borderClass: 'border-l-red-600', glow: '0 0 15px hsl(0 100% 50% / 0.3)' },
  medium: { label: 'MED', badgeClass: 'bg-yellow-900/60 text-yellow-300', borderClass: 'border-l-yellow-600', glow: 'none' },
  low: { label: 'LOW', badgeClass: 'bg-green-900/60 text-green-300', borderClass: 'border-l-green-600', glow: 'none' },
};

export default function TaskItem({ task, onEdit, onDelete, onToggleComplete }: TaskItemProps) {
  const [hovered, setHovered] = useState(false);
  const priority = priorityConfig[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative flex items-start gap-3 p-4 bg-[hsl(45,20%,88%)] border-l-4 rounded-sm polaroid-shadow transition-all',
        priority.borderClass,
        task.completed && 'opacity-60'
      )}
      style={{ boxShadow: task.priority === 'high' && !task.completed ? priority.glow : undefined }}
    >
      {/* Pin dot */}
      <div className="absolute -top-1.5 left-4 w-3 h-3 rounded-full bg-gradient-to-br from-red-700 to-red-900 border border-red-950 shadow-sm" />

      <button
        onClick={() => onToggleComplete(task.id)}
        className="mt-0.5 flex-shrink-0 transition-colors"
      >
        {task.completed ? (
          <CheckCircle2 className="w-5 h-5 text-red-700" />
        ) : (
          <Circle className="w-5 h-5 text-[hsl(30,15%,45%)] hover:text-red-700" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h3 className={cn(
          'font-detective text-sm font-bold text-[hsl(30,20%,15%)] leading-tight',
          task.completed && 'line-through text-[hsl(30,10%,45%)]'
        )}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-[11px] text-[hsl(30,15%,35%)] mt-1 line-clamp-2 leading-snug">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider', priority.badgeClass)}>
            {priority.label}
          </span>
          {task.dueDate && (
            <span className="text-[10px] text-[hsl(30,20%,40%)] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(parseISO(task.dueDate), 'MMM d')}
            </span>
          )}
        </div>

        {/* Status */}
        <div className="mt-2">
          {task.completed ? (
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: -12 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="stamp-text inline-block text-[10px] font-bold py-0.5 px-2 rounded-sm"
            >
              CASE CLOSED
            </motion.div>
          ) : (
            <div className="text-[10px] text-[hsl(30,15%,45%)] font-detective tracking-wide">
              🔍 UNDER INVESTIGATION
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-2 right-2 flex gap-1"
          >
            <button
              onClick={() => onEdit(task)}
              className="p-1 rounded bg-blue-800/80 hover:bg-blue-700 text-blue-200 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 rounded bg-red-800/80 hover:bg-red-700 text-red-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
