import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { formatToDateTime, formatToDate, isDateObject } from './date.util'

describe('date.util', () => {
  describe('formatToDateTime', () => {
    it('should format current date with default format', () => {
      const result = formatToDateTime()
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    })

    it('should format Date object with default format', () => {
      const date = new Date('2023-01-01T12:34:56')
      const result = formatToDateTime(date)
      expect(result).toBe('2023-01-01 12:34:56')
    })

    it('should format dayjs object with default format', () => {
      const date = dayjs('2023-01-01T12:34:56')
      const result = formatToDateTime(date)
      expect(result).toBe('2023-01-01 12:34:56')
    })

    it('should format timestamp with default format', () => {
      const timestamp = new Date('2023-01-01T12:34:56').getTime()
      const result = formatToDateTime(timestamp)
      expect(result).toBe('2023-01-01 12:34:56')
    })

    it('should format date string with default format', () => {
      const result = formatToDateTime('2023-01-01T12:34:56')
      expect(result).toBe('2023-01-01 12:34:56')
    })

    it('should use custom format when provided', () => {
      const date = new Date('2023-01-01T12:34:56')
      const result = formatToDateTime(date, 'YYYY/MM/DD')
      expect(result).toBe('2023/01/01')
    })

    it('should handle null input', () => {
      const result = formatToDateTime(null)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    })

    it('should handle undefined input', () => {
      const result = formatToDateTime(undefined)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    })
  })

  describe('formatToDate', () => {
    it('should format current date with default format', () => {
      const result = formatToDate()
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('should format Date object with default format', () => {
      const date = new Date('2023-01-01T12:34:56')
      const result = formatToDate(date)
      expect(result).toBe('2023-01-01')
    })

    it('should format dayjs object with default format', () => {
      const date = dayjs('2023-01-01T12:34:56')
      const result = formatToDate(date)
      expect(result).toBe('2023-01-01')
    })

    it('should format timestamp with default format', () => {
      const timestamp = new Date('2023-01-01T12:34:56').getTime()
      const result = formatToDate(timestamp)
      expect(result).toBe('2023-01-01')
    })

    it('should format date string with default format', () => {
      const result = formatToDate('2023-01-01T12:34:56')
      expect(result).toBe('2023-01-01')
    })

    it('should use custom format when provided', () => {
      const date = new Date('2023-01-01T12:34:56')
      const result = formatToDate(date, 'YYYY/MM/DD')
      expect(result).toBe('2023/01/01')
    })

    it('should handle null input', () => {
      const result = formatToDate(null)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('should handle undefined input', () => {
      const result = formatToDate(undefined)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe('isDateObject', () => {
    it('should return true for Date object', () => {
      const result = isDateObject(new Date())
      expect(result).toBe(true)
    })

    it('should return true for dayjs object', () => {
      const result = isDateObject(dayjs())
      expect(result).toBe(true)
    })

    it('should return false for string', () => {
      const result = isDateObject('2023-01-01')
      expect(result).toBe(false)
    })

    it('should return false for number', () => {
      const result = isDateObject(1234567890)
      expect(result).toBe(false)
    })

    it('should return false for null', () => {
      const result = isDateObject(null)
      expect(result).toBe(false)
    })

    it('should return false for undefined', () => {
      const result = isDateObject(undefined)
      expect(result).toBe(false)
    })

    it('should return false for object', () => {
      const result = isDateObject({})
      expect(result).toBe(false)
    })

    it('should return false for array', () => {
      const result = isDateObject([])
      expect(result).toBe(false)
    })

    it('should return false for boolean', () => {
      const result = isDateObject(true)
      expect(result).toBe(false)
    })
  })
})
