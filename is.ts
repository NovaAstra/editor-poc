export const isType = (type: string) =>
  (input: unknown) => Object.prototype.toString.call(input) === `[object ${type}]`

export const isWindow = isType("Window")

export const isBrowserEnv = isWindow(typeof window !== 'undefined' ? window : 0)

export const isTestEnv =
  (typeof navigator !== 'undefined' && navigator.userAgent.includes('jsdom')) ||
  // @ts-expect-error: jsdom
  (typeof window !== 'undefined' && window.jsdom)