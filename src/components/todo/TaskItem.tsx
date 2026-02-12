import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2, Clock, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const priorityStyles = {
  high: 'border-l-destructive',
  medium: 'border-l-warning',
  low: 'border-l-success',
};

const priorityBadge = {
  high: 'bg-destructive/10 text-destructive',
  medium: 'bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning))]',
  low: 'bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]',
};

export default function TaskItem({ task, onEdit, onDelete, onToggleComplete }: TaskItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group flex items-start gap-3 p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4',
        priorityStyles[task.priority],
        task.completed && 'opacity-60'
      )}
    >
      <button
        onClick={() => onToggleComplete(task.id)}
        className="mt-0.5 flex-shrink-0 transition-colors"
      >
        {task.completed ? (
          <CheckCircle2 className="w-5 h-5 text-primary" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h3 className={cn(
          'text-sm font-semibold text-foreground leading-tight',
          task.completed && 'line-through text-muted-foreground'
        )}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider', priorityBadge[task.priority])}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(parseISO(task.dueDate), 'MMM d, yyyy')}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
