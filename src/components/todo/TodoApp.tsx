import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Shield } from 'lucide-react';
import { Task } from '@/types/task';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import TaskItem from './TaskItem';
import AddTaskModal from './AddTaskModal';
import Stopwatch from './Stopwatch';
import { Button } from '@/components/ui/button';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function TodoApp() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('todo-tasks', []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleSave = useCallback((data: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    if (editingTask) {
      setTasks(prev => prev.map(t =>
        t.id === editingTask.id ? { ...t, ...data } : t
      ));
    } else {
      const newTask: Task = {
        ...data,
        id: generateId(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [newTask, ...prev]);
    }
    setEditingTask(null);
  }, [editingTask, setTasks]);

  const handleDelete = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, [setTasks]);

  const handleToggleComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  }, [setTasks]);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  const openNewModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen cork-texture">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="font-detective text-xl sm:text-2xl text-foreground tracking-wide">
              CASEBOARD
            </h1>
          </div>
          <Stopwatch />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Stats & Add */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-detective text-muted-foreground">
              <span className="font-bold text-foreground">{tasks.length}</span> cases
            </span>
            <span className="text-sm font-detective text-muted-foreground">
              <span className="font-bold text-primary">{completedCount}</span> closed
            </span>
          </div>
          <Button onClick={openNewModal} size="sm" className="gap-1.5 font-detective">
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-secondary/50 p-1 rounded">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-xs font-detective tracking-wider rounded capitalize transition-all ${
                filter === f
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'active' ? '🔍 Active' : f === 'completed' ? '✅ Closed' : '📋 All'}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </AnimatePresence>

          {filteredTasks.length === 0 && (
            <div className="text-center py-16 text-muted-foreground font-detective">
              <p className="text-2xl mb-2">No open cases</p>
              <p className="text-sm">Click "New Task" to start an investigation</p>
            </div>
          )}
        </div>
      </div>

      <AddTaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSave={handleSave}
        editTask={editingTask}
      />
    </div>
  );
}
