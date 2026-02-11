import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Shield } from 'lucide-react';
import { Task } from '@/types/task';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useIsMobile } from '@/hooks/use-mobile';
import { requestNotificationPermission, checkDueNotifications } from './NotificationService';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import RedThreads from './RedThreads';
import { Button } from '@/components/ui/button';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function randomPosition(index: number) {
  const cols = 3;
  const col = index % cols;
  const row = Math.floor(index / cols);
  return {
    x: 60 + col * 300 + (Math.random() * 40 - 20),
    y: 100 + row * 260 + (Math.random() * 30 - 15),
  };
}

export default function CaseBoard() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('caseboard-tasks', []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    checkDueNotifications(tasks);
    const interval = setInterval(() => checkDueNotifications(tasks), 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  const handleSave = useCallback((data: Omit<Task, 'id' | 'createdAt' | 'position' | 'completed'>) => {
    if (editingTask) {
      setTasks(prev => prev.map(t =>
        t.id === editingTask.id ? { ...t, ...data } : t
      ));
    } else {
      const newTask: Task = {
        ...data,
        id: generateId(),
        completed: false,
        position: randomPosition(tasks.length),
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [...prev, newTask]);
    }
    setEditingTask(null);
  }, [editingTask, tasks.length, setTasks]);

  const handleDelete = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, [setTasks]);

  const handleToggleComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  }, [setTasks]);

  const handleDragEnd = useCallback((id: string, x: number, y: number) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, position: { x: Math.max(0, x), y: Math.max(60, y) } } : t
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

  return (
    <div className="min-h-screen cork-texture relative overflow-auto">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="font-detective text-xl sm:text-2xl text-foreground tracking-wide">
            CASEBOARD
          </h1>
        </div>
        <Button onClick={openNewModal} size="sm" className="gap-1.5 font-detective">
          <Plus className="w-4 h-4" />
          New Case
        </Button>
      </div>

      {/* Board */}
      <div
        className={
          isMobile
            ? 'flex flex-col items-center gap-6 p-4 pt-6'
            : 'relative min-h-[calc(100vh-60px)]'
        }
        style={!isMobile ? { minHeight: Math.max(800, tasks.length * 150 + 200) } : {}}
      >
        {!isMobile && <RedThreads tasks={tasks} />}

        <AnimatePresence>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
              onDragEnd={handleDragEnd}
              isMobile={!!isMobile}
            />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground font-detective">
              <p className="text-2xl mb-2">No open cases</p>
              <p className="text-sm">Click "New Case" to start an investigation</p>
            </div>
          </div>
        )}
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
