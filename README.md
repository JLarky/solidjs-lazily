# solidjs-lazily

[![minzip size](https://badgen.net/bundlephobia/minzip/solidjs-lazily)](https://bundlephobia.com/result?p=solidjs-lazily)
[![install size](https://badgen.net/packagephobia/install/solidjs-lazily)](https://packagephobia.com/result?p=solidjs-lazily)
[![dependency count](https://badgen.net/bundlephobia/dependency-count/solidjs-lazily)](https://bundlephobia.com/result?p=solidjs-lazily)

solidjs-lazily is a simple wrapper around SolidJS's `lazy` that supports named imports.

> [!IMPORTANT]
> **solidjs-lazily only works with Solid 1.x.** Solid 2.0 supports named exports in `lazy` out of the box, so you don't need this package anymore. See [Migrating to Solid 2.0](#migrating-to-solid-20).

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

## Migrating to Solid 2.0

In Solid 2.0, `lazy` takes an `export` option that picks a named export from the module. Replace `lazily` with `lazy` and the `export` field:

```ts
// Solid 1.x with solidjs-lazily
import { lazily } from 'solidjs-lazily'
const { MyComponent } = lazily(() => import('./MyComponent'))

// Solid 2.0
import { lazy } from 'solid-js'
const MyComponent = lazy(() => import('./MyComponent'), { export: 'MyComponent' })
```

If you load several components from one module, call `lazy` once per component:

```ts
const loader = () => import('./components')
const Header = lazy(loader, { export: 'Header' })
const Footer = lazy(loader, { export: 'Footer' })
```

Also note that `Suspense` is called `Loading` in Solid 2.0. Then remove the package:

```shell
npm uninstall solidjs-lazily
```

See the [Solid 2.0 migration guide](https://github.com/solidjs/solid/blob/main/documentation/solid-2.0/MIGRATION.md) for everything else that changed.

## Related

- https://www.npmjs.com/package/react-lazily
