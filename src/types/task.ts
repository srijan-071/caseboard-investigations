export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}
