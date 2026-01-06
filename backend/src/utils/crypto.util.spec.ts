import { describe, it, expect } from 'vitest'
import { aesEncrypt, aesDecrypt, md5 } from './crypto.util'

describe('crypto.util', () => {
  describe('aesEncrypt', () => {
    it('should encrypt string successfully', () => {
      const data = 'test data for encryption'
      const result = aesEncrypt(data)
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result).not.toBe(data)
    })

    it('should encrypt empty string', () => {
      const result = aesEncrypt('')
      expect(result).toBe('')
    })

    it('should return null when input is null', () => {
      const result = aesEncrypt(null)
      expect(result).toBe(null)
    })

    it('should return undefined when input is undefined', () => {
      const result = aesEncrypt(undefined)
      expect(result).toBe(undefined)
    })
  })

  describe('aesDecrypt', () => {
    it('should decrypt empty string correctly', () => {
      const result = aesDecrypt('')
      expect(result).toBe('')
    })

    it('should return null when input is null', () => {
      const result = aesDecrypt(null)
      expect(result).toBe(null)
    })

    it('should return undefined when input is undefined', () => {
      const result = aesDecrypt(undefined)
      expect(result).toBe(undefined)
    })
  })

  describe('md5', () => {
    it('should generate md5 hash for string', () => {
      const data = 'test data for md5'
      const result = md5(data)
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBe(32)
    })

    it('should generate consistent md5 hash for same input', () => {
      const data = 'test data for consistent hash'
      const result1 = md5(data)
      const result2 = md5(data)
      expect(result1).toBe(result2)
    })

    it('should generate different md5 hashes for different inputs', () => {
      const data1 = 'test data 1'
      const data2 = 'test data 2'
      const result1 = md5(data1)
      const result2 = md5(data2)
      expect(result1).not.toBe(result2)
    })

    it('should handle empty string', () => {
      // 实际实现中，空字符串会直接返回，因为!str条件为真
      const result = md5('')
      expect(result).toBe('')
    })

    it('should handle long string', () => {
      const longData = 'a'.repeat(1000)
      const result = md5(longData)
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBe(32)
    })

    it('should handle numeric string', () => {
      const numericData = '1234567890'
      const result = md5(numericData)
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBe(32)
    })

    it('should return null when input is null', () => {
      const result = md5(null)
      expect(result).toBe(null)
    })

    it('should return undefined when input is undefined', () => {
      const result = md5(undefined)
      expect(result).toBe(undefined)
    })
  })
})
