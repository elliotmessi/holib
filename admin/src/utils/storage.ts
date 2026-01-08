/**
 * 存储工具类 - 简洁版
 * 特点：
 * 1. 通过类实例化时指定存储类型
 * 2. 接口简洁，只包含 get/set/remove/clear 四个基本方法
 * 3. 支持键前缀功能（仅用于localStorage），避免命名冲突
 * 4. 包含错误处理和空间检查
 */

/**
 * 存储类型枚举
 */
export enum StorageType {
  LOCAL = 'local',
  SESSION = 'session',
  COOKIE = 'cookie',
}

/**
 * 存储空间常量（5MB）
 */
const MAX_STORAGE_SIZE = 5 * 1024 * 1024

/**
 * 键前缀，用于区分不同应用或模块的存储（仅用于localStorage）
 */
const KEY_PREFIX = 'hotspital-admin:'

/**
 * 存储服务类
 */
export class StorageService {
  private storage!: Storage
  private type: StorageType

  /**
   * 构造函数
   * @param type 存储类型
   */
  constructor(type: StorageType) {
    this.type = type
    if (type === StorageType.COOKIE) {
      // Cookie不需要初始化storage对象
      return
    }
    this.storage = type === StorageType.LOCAL ? localStorage : sessionStorage
  }

  /**
   * 获取带前缀的键名（仅用于localStorage）
   * @param key 原始键名
   * @returns 带前缀的键名
   */
  private getPrefixedKey(key: string): string {
    return `${KEY_PREFIX}${key}`
  }

  /**
   * 检查存储空间是否足够
   * @param itemSize 要存储的项目大小（字节）
   * @returns 是否有足够空间
   */
  private checkStorageSpace(itemSize: number): boolean {
    // Cookie不进行空间检查
    if (this.type === StorageType.COOKIE) {
      return true
    }

    try {
      // 创建一个测试项来检查空间是否足够
      // localStorage使用前缀，sessionStorage不使用前缀
      const testKey =
        this.type === StorageType.LOCAL
          ? this.getPrefixedKey(`__test_${Date.now()}`)
          : `__test_${Date.now()}`
      const testData = new Array(Math.ceil(itemSize / 2)).join('x')

      this.storage.setItem(testKey, testData)
      this.storage.removeItem(testKey)
      return true
    } catch (error) {
      console.error('Storage space is insufficient:', error)
      return false
    }
  }

  /**
   * 设置存储项
   * @param key 键名
   * @param value 值
   * @param expire 过期时间（毫秒），可选
   * @returns 是否设置成功
   */
  public set<T>(key: string, value: T, expire?: number): boolean {
    try {
      if (this.type === StorageType.COOKIE) {
        // Cookie存储逻辑 - 不使用前缀
        // 对于字符串类型的值，直接使用，不添加双引号
        const cookieValue = typeof value === 'string' ? value : JSON.stringify(value)
        let cookieString = `${key}=${encodeURIComponent(cookieValue)}`

        // 设置过期时间
        if (expire) {
          const expireDate = new Date(Date.now() + expire)
          cookieString += `; expires=${expireDate.toUTCString()}`
        }

        // 设置路径
        cookieString += '; path=/'

        document.cookie = cookieString
        return true
      }

      // localStorage使用前缀，sessionStorage不使用前缀
      const finalKey = this.type === StorageType.LOCAL ? this.getPrefixedKey(key) : key

      // 准备要存储的数据
      const itemToStore = {
        value,
        expire: expire ? Date.now() + expire : null,
      }

      const itemValue = JSON.stringify(itemToStore)
      const itemSize = new Blob([itemValue]).size

      // 检查是否超出存储限制
      if (itemSize > MAX_STORAGE_SIZE) {
        console.error('Storage item size exceeds maximum limit')
        return false
      }

      // 检查存储空间是否足够
      if (!this.checkStorageSpace(itemSize)) {
        return false
      }

      this.storage.setItem(finalKey, itemValue)
      return true
    } catch (error) {
      console.error(`Failed to set storage item: ${error}`)
      return false
    }
  }

  /**
   * 获取存储项
   * @param key 键名
   * @param defaultValue 默认值，可选
   * @returns 获取的值或默认值
   */
  public get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      if (this.type === StorageType.COOKIE) {
        // Cookie获取逻辑 - 不使用前缀
        const cookieName = `${key}=`
        const decodedCookie = decodeURIComponent(document.cookie)
        const cookieArray = decodedCookie.split(';')

        for (let i = 0; i < cookieArray.length; i++) {
          let cookie = cookieArray[i]
          while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1)
          }
          if (cookie.indexOf(cookieName) === 0) {
            const cookieValue = cookie.substring(cookieName.length, cookie.length)
            // 尝试直接返回值，如果失败则使用JSON.parse
            try {
              return cookieValue as unknown as T
            } catch {
              return JSON.parse(cookieValue) as T
            }
          }
        }
        return defaultValue
      }

      // localStorage使用前缀，sessionStorage不使用前缀
      const finalKey = this.type === StorageType.LOCAL ? this.getPrefixedKey(key) : key

      const item = this.storage.getItem(finalKey)

      if (!item) {
        return defaultValue
      }

      const parsedItem = JSON.parse(item)

      // 检查是否过期
      if (parsedItem.expire && parsedItem.expire < Date.now()) {
        this.storage.removeItem(finalKey)
        return defaultValue
      }

      return parsedItem.value as T
    } catch (error) {
      console.error(`Failed to get storage item: ${error}`)
      return defaultValue
    }
  }

  /**
   * 移除存储项
   * @param key 键名
   * @returns 是否移除成功
   */
  public remove(key: string): boolean {
    try {
      if (this.type === StorageType.COOKIE) {
        // Cookie移除逻辑 - 不使用前缀
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        return true
      }

      // localStorage使用前缀，sessionStorage不使用前缀
      const finalKey = this.type === StorageType.LOCAL ? this.getPrefixedKey(key) : key

      this.storage.removeItem(finalKey)
      return true
    } catch (error) {
      console.error(`Failed to remove storage item: ${error}`)
      return false
    }
  }

  /**
   * 清除所有存储项
   * @returns 是否清除成功
   */
  public clear(): boolean {
    try {
      if (this.type === StorageType.COOKIE) {
        // Cookie清除逻辑 - 清除所有cookie
        const cookies = document.cookie.split(';')

        cookies.forEach((cookie) => {
          const cookieName = cookie.trim().split('=')[0]
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        })
        return true
      }

      // localStorage清除带前缀的项，sessionStorage清除所有项
      if (this.type === StorageType.LOCAL) {
        const keys = Object.keys(this.storage)

        keys.forEach((key) => {
          if (key.startsWith(KEY_PREFIX)) {
            this.storage.removeItem(key)
          }
        })
      } else {
        // sessionStorage直接清除所有项
        this.storage.clear()
      }

      return true
    } catch (error) {
      console.error(`Failed to clear storage: ${error}`)
      return false
    }
  }
}

// 创建便捷实例
export const local = new StorageService(StorageType.LOCAL)
export const session = new StorageService(StorageType.SESSION)
export const cookie = new StorageService(StorageType.COOKIE)

// 默认导出
const storage = {
  StorageType,
  local,
  session,
  cookie,
}

export default storage
