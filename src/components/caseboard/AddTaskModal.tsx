import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, FolderOpen } from 'lucide-react';
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
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'position' | 'completed'>) => void;
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
      setError('Case title is required');
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

  const priorities: { value: Priority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'bg-green-800/60 text-green-300 border-green-700' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-800/60 text-yellow-300 border-yellow-700' },
    { value: 'high', label: 'High', color: 'bg-red-800/60 text-red-300 border-red-700' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card border border-border rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Header - Case File Tab */}
            <div className="bg-secondary px-6 py-4 border-b border-border flex items-center gap-3">
              <FolderOpen className="w-5 h-5 text-primary" />
              <h2 className="font-detective text-lg text-foreground">
                {editTask ? 'EDIT CASE FILE' : 'NEW CASE FILE'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
                  Case Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setError(''); }}
                  placeholder="Enter case title..."
                  className="bg-muted border-border text-foreground"
                />
                {error && <p className="text-destructive text-xs mt-1">{error}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Case details..."
                  rows={3}
                  className="bg-muted border-border text-foreground resize-none"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
                  Due Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left bg-muted border-border',
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

              {/* Priority */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Priority Level
                </label>
                <div className="flex gap-2">
                  {priorities.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={cn(
                        'flex-1 py-2 text-xs font-bold rounded border transition-all uppercase tracking-wider',
                        priority === p.value
                          ? cn(p.color, 'ring-1 ring-ring')
                          : 'bg-muted text-muted-foreground border-border hover:bg-secondary'
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editTask ? 'Update Case' : 'Open Case'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
