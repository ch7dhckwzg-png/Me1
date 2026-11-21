import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Join class names and let later Tailwind classes override earlier ones (used by Magic UI). */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
