import { useState, useEffect, useCallback } from 'react'
import { publicAPI } from '../services/api'

// Global calendar refresh event system
class CalendarSyncManager {
  private listeners: Set<() => void> = new Set()
  private lastRefresh: number = 0

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  notifyRefresh() {
    this.lastRefresh = Date.now()
    this.listeners.forEach(listener => listener())
  }

  getLastRefresh() {
    return this.lastRefresh
  }
}

export const calendarSyncManager = new CalendarSyncManager()

export const useCalendarSync = () => {
  const [bookedDates, setBookedDates] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const fetchBookedDates = useCallback(async () => {
    setLoading(true)
    try {
      const response = await publicAPI.getAvailability()
      if (response.data && response.data.success && response.data.bookedDates) {
        setBookedDates(response.data.bookedDates)
      }
    } catch (error) {
      console.error('Error fetching booked dates:', error)
      setBookedDates([])
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshCalendar = useCallback(() => {
    fetchBookedDates()
  }, [fetchBookedDates])

  useEffect(() => {
    // Initial fetch
    fetchBookedDates()

    // Subscribe to global refresh events
    const unsubscribe = calendarSyncManager.subscribe(refreshCalendar)

    return () => {
      unsubscribe()
    }
  }, [fetchBookedDates, refreshCalendar])

  return {
    bookedDates,
    loading,
    refreshCalendar
  }
}