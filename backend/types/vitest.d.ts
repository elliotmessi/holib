/// <reference types="vitest/globals" />

import type { MockedClass, MockedFunction, MockedObject, Vi } from 'vitest'

export {}

declare global {
  namespace Vi {
    interface AsymmetricMatchersContaining {
      toContainEqual(expected: any): void
    }
  }

  type Mocked<T> = T extends Function
    ? T extends new (...args: infer A) => infer R
      ? MockedClass<R> & MockedObject<A> & MockedFunction
      : MockedFunction & T
    : T extends object
      ? MockedObject<T>
      : T
}
