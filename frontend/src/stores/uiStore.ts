/**
 * UI State Management (Pinia)
 * Manages notifications, modals, and UI state
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Notification, Modal } from '@/types'

let notificationId = 0
let modalId = 0

export const useUiStore = defineStore('ui', () => {
  // State
  const notifications = ref<Notification[]>([])
  const modals = ref<Modal[]>([])
  const isSidebarOpen = ref(false)
  const isLoading = ref(false)

  // Actions
  const addNotification = (notification: Omit<Notification, 'id'>): void => {
    const id = String(++notificationId)
    const newNotification: Notification = { ...notification, id }
    notifications.value.push(newNotification)

    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration ?? 3000)
    }
  }

  const removeNotification = (id: string): void => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = (): void => {
    notifications.value = []
  }

  const showSuccess = (message: string, duration?: number): void => {
    addNotification({
      type: 'success',
      message,
      duration,
    })
  }

  const showError = (message: string, duration?: number): void => {
    addNotification({
      type: 'error',
      message,
      duration,
    })
  }

  const showInfo = (message: string, duration?: number): void => {
    addNotification({
      type: 'info',
      message,
      duration,
    })
  }

  const showWarning = (message: string, duration?: number): void => {
    addNotification({
      type: 'warning',
      message,
      duration,
    })
  }

  const addModal = (modal: Omit<Modal, 'id'>): string => {
    const id = String(++modalId)
    modals.value.push({ ...modal, id })
    return id
  }

  const removeModal = (id: string): void => {
    const index = modals.value.findIndex((m) => m.id === id)
    if (index > -1) {
      modals.value.splice(index, 1)
    }
  }

  const toggleSidebar = (): void => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const openSidebar = (): void => {
    isSidebarOpen.value = true
  }

  const closeSidebar = (): void => {
    isSidebarOpen.value = false
  }

  const setLoading = (loading: boolean): void => {
    isLoading.value = loading
  }

  return {
    // State
    notifications,
    modals,
    isSidebarOpen,
    isLoading,

    // Actions
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    addModal,
    removeModal,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    setLoading,
  }
})
