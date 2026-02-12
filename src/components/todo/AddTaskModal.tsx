import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, Priority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  editTask?: Task | null;
}

export default function AddTaskModal({ open, onClose, onSave, editTask }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setDueDate(editTask.dueDate ? new Date(editTask.dueDate) : undefined);
      setPriority(editTask.priority);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(undefined);
      setPriority('medium');
    }
    setError('');
  }, [editTask, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? dueDate.toISOString() : null,
      priority,
    });
    onClose();
  };

  const priorities: { value: Priority; label: string; activeClass: string }[] = [
    { value: 'low', label: 'Low', activeClass: 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]' },
    { value: 'medium', label: 'Medium', activeClass: 'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]' },
    { value: 'high', label: 'High', activeClass: 'bg-destructive text-destructive-foreground' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                {editTask ? 'Edit Task' : 'New Task'}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {editTask ? 'Update your task details' : 'Add a new task to your list'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setError(''); }}
                  placeholder="What needs to be done?"
                  className="bg-background border-border"
                />
                {error && <p className="text-destructive text-xs mt-1">{error}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details..."
                  rows={3}
                  className="bg-background border-border resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Due Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left bg-background border-border',
                        !dueDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[110]" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Priority
                </label>
                <div className="flex gap-2">
                  {priorities.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={cn(
                        'flex-1 py-2 text-xs font-semibold rounded-lg border transition-all uppercase tracking-wider',
                        priority === p.value
                          ? cn(p.activeClass, 'border-transparent ring-2 ring-ring/20')
                          : 'bg-background text-muted-foreground border-border hover:bg-secondary'
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editTask ? 'Update' : 'Add Task'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
