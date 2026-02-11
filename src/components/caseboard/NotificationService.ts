import { Task } from '@/types/task';
import { isToday, parseISO } from 'date-fns';

export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function checkDueNotifications(tasks: Task[]) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  tasks.forEach(task => {
    if (!task.completed && task.dueDate && isToday(parseISO(task.dueDate))) {
      new Notification('🔍 CaseBoard Reminder', {
        body: `Case "${task.title}" is due today!`,
        icon: '/favicon.ico',
      });
    }
  });
}
