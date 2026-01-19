import Keyv from 'keyv'
import { Inject, Injectable } from '@nestjs/common'
import { Emitter } from '@socket.io/redis-emitter'

import { InjectRedis } from '~/common/decorators/inject-redis.decorator'
import { RedisIoAdapterKey } from '~/common/adapters/socket.adapter'

import { API_CACHE_PREFIX } from '~/constants/cache.constant'
import { getRedisKey } from '~/utils/redis.util'
import Redis from 'ioredis'

export type TCacheKey = string
export type TCacheResult<T> = Promise<T | undefined>

@Injectable()
export class CacheService {
  private keyv: Keyv

  private ioRedis!: Redis

  constructor(@InjectRedis() private readonly redis: Redis) {
    this.keyv = new Keyv({ store: new KeyvRedisStore(this.redis) })
  }

  public get<T>(key: TCacheKey): TCacheResult<T> {
    return this.keyv.get(key)
  }

  public set(key: TCacheKey, value: any, milliseconds: number) {
    return this.keyv.set(key, value, milliseconds)
  }

  public getClient(): Redis {
    return this.redis
  }

  public async delete(key: TCacheKey) {
    return this.keyv.delete(key)
  }

  private _emitter: Emitter

  public get emitter(): Emitter {
    if (this._emitter) return this._emitter

    this._emitter = new Emitter(this.redis, {
      key: RedisIoAdapterKey,
    })

    return this._emitter
  }

  public async cleanCatch() {
    const redis = this.redis
    const keys: string[] = await redis.keys(`${API_CACHE_PREFIX}*`)
    await Promise.all(keys.map(key => redis.del(key)))
  }

  public async cleanAllRedisKey() {
    const redis = this.redis
    const keys: string[] = await redis.keys(getRedisKey('*'))

    await Promise.all(keys.map(key => redis.del(key)))
  }
}

class KeyvRedisStore {
  private redis: Redis

  constructor(redis: Redis) {
    this.redis = redis
  }

  async get(key: string) {
    const value = await this.redis.get(key)
    return value ?? undefined
  }

  async set(key: string, value: any, ttl?: number) {
    if (ttl) {
      await this.redis.set(key, value, 'EX', Math.floor(ttl / 1000))
    } else {
      await this.redis.set(key, value)
    }
    return true
  }

  async delete(key: string) {
    const result = await this.redis.del(key)
    return result > 0
  }

  async *iterator() {
    const pattern = '*'
    let cursor = '0'
    do {
      const [newCursor, keys] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100)
      cursor = newCursor
      for (const key of keys) {
        const value = await this.redis.get(key)
        yield [key, value]
      }
    } while (cursor !== '0')
  }

  async clear() {
    const pattern = '*'
    let cursor = '0'
    do {
      const [newCursor, keys] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100)
      cursor = newCursor
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } while (cursor !== '0')
  }
}
