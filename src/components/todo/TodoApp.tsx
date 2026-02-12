import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, ListTodo } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <ListTodo className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Todo List</h1>
          </div>
          <Stopwatch />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Stats & Add */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{tasks.length}</span> tasks
            </span>
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">{completedCount}</span> done
            </span>
          </div>
          <Button onClick={openNewModal} size="sm" className="gap-1.5 rounded-xl">
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-secondary/50 p-1 rounded-xl">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                filter === f
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-2">
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
            <div className="text-center py-16 text-muted-foreground">
              <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">No tasks yet</p>
              <p className="text-sm mt-1">Click "New Task" to get started</p>
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
