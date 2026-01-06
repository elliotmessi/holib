import { describe, it, expect } from 'vitest'
import {
  getAvatar,
  generateUUID,
  generateShortUUID,
  randomValue,
  generateRandomValue,
  hashString,
  uniqueSlash,
} from './tool.util'

describe('tool.util', () => {
  describe('getAvatar', () => {
    it('should return empty string when mail is undefined', () => {
      const result = getAvatar(undefined)
      expect(result).toBe('')
    })
  })

  describe('generateUUID', () => {
    it('should generate UUID with default size 21', () => {
      const result = generateUUID()
      expect(result.length).toBe(21)
    })
  })

  describe('generateShortUUID', () => {
    it('should generate short UUID with size 10', () => {
      const result = generateShortUUID()
      expect(result.length).toBe(10)
    })
  })

  describe('randomValue', () => {
    it('should generate random value with default size 16', () => {
      const result = randomValue()
      expect(result.length).toBe(16)
    })
  })

  describe('generateRandomValue', () => {
    it('should generate random value with default placeholder', () => {
      const length = 10
      const result = generateRandomValue(length)
      expect(result.length).toBe(length)
    })
  })

  describe('hashString', () => {
    it('should generate same hash for same string', () => {
      const result1 = hashString('test')
      const result2 = hashString('test')
      expect(result1).toBe(result2)
    })
  })

  describe('uniqueSlash', () => {
    it('should normalize multiple slashes', () => {
      const result = uniqueSlash('https://example.com//path//to//resource')
      expect(result).toBe('https://example.com/path/to/resource')
    })
  })
})
