import { type ClassValue, clsx } from 'clsx';

// Simple implementation without tailwind-merge to avoid additional dependency
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}