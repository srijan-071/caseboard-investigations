import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  isMobile: boolean;
}

const priorityConfig = {
  high: { label: 'HIGH', className: 'bg-red-900/60 text-red-300', glow: '0 0 20px hsl(0 100% 50% / 0.4)' },
  medium: { label: 'MED', className: 'bg-yellow-900/60 text-yellow-300', glow: 'none' },
  low: { label: 'LOW', className: 'bg-green-900/60 text-green-300', glow: 'none' },
};

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete, onDragEnd, isMobile }: TaskCardProps) {
  const [hovered, setHovered] = useState(false);
  const priority = priorityConfig[task.priority];

  return (
    <motion.div
      layout
      initial={{ scale: 0, rotate: -10, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{ scale: 0, rotate: 10, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      drag={!isMobile}
      dragMomentum={false}
      onDragEnd={(_e, info) => {
        onDragEnd(task.id, task.position.x + info.offset.x, task.position.y + info.offset.y);
      }}
      style={isMobile ? {} : { position: 'absolute', left: task.position.x, top: task.position.y }}
      className={cn(
        'w-64 select-none cursor-grab active:cursor-grabbing z-10',
        isMobile && 'relative'
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.03, zIndex: 50 }}
    >
      {/* Pin */}
      <div className="flex justify-center -mb-2 relative z-20">
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-700 to-red-900 border border-red-950 shadow-md" />
      </div>

      {/* Polaroid Card */}
      <div
        className="bg-[hsl(45,20%,90%)] rounded-sm p-3 pb-4 polaroid-shadow relative overflow-hidden"
        style={{ boxShadow: task.priority === 'high' ? priority.glow : undefined }}
      >
        {/* Priority Badge */}
        <div className="flex justify-between items-start mb-2">
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider', priority.className)}>
            {priority.label}
          </span>
          {task.dueDate && (
            <span className="text-[10px] text-[hsl(30,20%,40%)] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(parseISO(task.dueDate), 'MMM d')}
            </span>
          )}
        </div>

        {/* Content */}
        <h3 className="font-detective text-sm font-bold text-[hsl(30,20%,15%)] mb-1 leading-tight">
          {task.title}
        </h3>
        {task.description && (
          <p className="text-[11px] text-[hsl(30,15%,35%)] line-clamp-2 leading-snug">
            {task.description}
          </p>
        )}

        {/* Status Label */}
        <div className="mt-3">
          {task.completed ? (
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: -12 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="stamp-text text-center text-xs font-bold py-1 px-2 rounded-sm"
            >
              CASE CLOSED
            </motion.div>
          ) : (
            <div className="text-[10px] text-[hsl(30,15%,45%)] font-detective tracking-wide">
              🔍 UNDER INVESTIGATION
            </div>
          )}
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
                onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }}
                className="p-1 rounded bg-green-800/80 hover:bg-green-700 text-green-200 transition-colors"
                title={task.completed ? 'Reopen' : 'Close Case'}
              >
                <CheckCircle className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                className="p-1 rounded bg-blue-800/80 hover:bg-blue-700 text-blue-200 transition-colors"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                className="p-1 rounded bg-red-800/80 hover:bg-red-700 text-red-200 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
