import { lazy } from 'solid-js'

export type Lazily<T> = {
  [K in keyof T]: T[K] & {
    preload: () => Promise<T>
    moduleUrl?: string
  }
}

export const lazily = <T extends Record<string, any>>(
  loader: (exportName?: string) => Promise<T>
): Lazily<T> =>
  new Proxy({} as Lazily<T>, {
    get: (_target, exportName: string | symbol) => {
      if (typeof exportName === 'string') {
        return lazy(() => loader(exportName), {
          export: exportName as keyof T & string,
        })
      }
    },
  })
