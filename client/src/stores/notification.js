import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: []
  }),
  actions: {
    add({ type = 'success', title, message, duration = 3000 }) {
      const id = Date.now() + Math.random()
      this.notifications.push({ id, type, title, message })

      // លុបចេញវិញដោយស្វ័យប្រវត្តិ
      setTimeout(() => {
        this.remove(id)
      }, duration)
    },
    remove(id) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    },
    // ហៅកាត់សម្រាប់ករណីជោគជ័យ
    success(message) {
      this.add({ type: 'success', title: 'ជោគជ័យ', message })
    },
    // ហៅកាត់សម្រាប់ករណីបរាជ័យ
    error(message) {
      this.add({ type: 'error', title: 'បរាជ័យ', message })
    }
  }
})