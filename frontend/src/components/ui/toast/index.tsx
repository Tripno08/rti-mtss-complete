"use client"

import { toast } from 'sonner';

interface ToastProps {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

export function showToast({ title, message, type = 'info' }: ToastProps) {
  switch (type) {
    case 'success':
      toast.success(message, {
        description: title,
      });
      break;
    case 'error':
      toast.error(message, {
        description: title,
      });
      break;
    case 'warning':
      toast.warning(message, {
        description: title,
      });
      break;
    default:
      toast(message, {
        description: title,
      });
  }
} 