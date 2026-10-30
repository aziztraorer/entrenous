/**
 * Central export of all types
 */

export * from './game'
export * from './api'

// Utility types
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  duration?: number
}

export interface Modal {
  id: string
  type: 'alert' | 'confirm' | 'info'
  title: string
  message: string
  action?: string
}
