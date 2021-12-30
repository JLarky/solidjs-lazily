# solidjs-lazily

[![minzip size](https://badgen.net/bundlephobia/minzip/solidjs-lazily)](https://bundlephobia.com/result?p=solidjs-lazily)
[![install size](https://badgen.net/packagephobia/install/solidjs-lazily)](https://packagephobia.com/result?p=solidjs-lazily)
[![dependency count](https://badgen.net/bundlephobia/dependency-count/solidjs-lazily)](https://bundlephobia.com/result?p=solidjs-lazily)

solidjs-lazily is a simple wrapper around SolidJS's `lazy` that supports named imports.

## TL;DR

run this

```shell
npm install solidjs-lazily
# or
yarn add solidjs-lazily
```

write this

```js
import { lazily } from 'solidjs-lazily'
const { MyComponent } = lazily(() => import('./MyComponent'))
```

instead of this

```js
import { lazy } from 'solid-js'
const MyComponent = lazy(() => import('./MyComponent'))
```

## Motivation

Consider that component `MyComponent` is exported with `export default MyComponent` then per solidjs docs you could do:

```ts
import { lazy } from 'solid-js'
const MyComponent = lazy(() => import('./MyComponent'))
```

But if the component is exported with named export `export const MyComponent = ...` then you have to do:

```ts
const MyComponent = lazy(() =>
  import('./MyComponent').then((module) => ({ default: module.MyComponent }))
)
```

With `solidjs-lazily` it becomes:

```ts
import { lazily } from 'solidjs-lazily'
const { MyComponent } = lazily(() => import('./MyComponent'))
```

## Full example

See: https://codesandbox.io/s/solidjs-lazily-example-qvv3y

```ts
import { createSignal, Suspense } from 'solid-js'
import { lazily } from 'solidjs-lazily'

const { MyComponent } = lazily(() => import('./MyComponent'))

const App = () => {
  const [open, setOpen] = createSignal(false)
  return (
    <>
      {open() ? (
        <Suspense fallback={<>Loading...</>}>
          <MyComponent />
        </Suspense>
      ) : (
        <button onClick={() => setOpen(true)}>Load</button>
      )}
    </>
  )
}
```

## Related

- https://www.npmjs.com/package/react-lazily
