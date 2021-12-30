import { Component, lazy } from 'solid-js'

export const lazily = <T extends {}, U extends keyof T>(
  loader: (x?: string) => Promise<T>
) =>
  new Proxy({} as unknown as T, {
    get: (_target, componentName: string | symbol) => {
      if (typeof componentName === 'string') {
        return lazy(() =>
          loader(componentName).then((x) => ({
            default: x[componentName as U] as any as Component<any>,
          }))
        )
      }
    },
  })
