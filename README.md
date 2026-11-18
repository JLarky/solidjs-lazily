# solidjs-lazily

[![minzip size](https://badgen.net/bundlephobia/minzip/solidjs-lazily)](https://bundlephobia.com/result?p=solidjs-lazily)
[![install size](https://badgen.net/packagephobia/install/solidjs-lazily)](https://packagephobia.com/result?p=solidjs-lazily)
[![dependency count](https://badgen.net/bundlephobia/dependency-count/solidjs-lazily)](https://bundlephobia.com/result?p=solidjs-lazily)

solidjs-lazily is a simple wrapper around SolidJS's `lazy` that supports named imports.

> [!TIP]
> **You might not need this with Solid 2.0.** Solid 2.0's `lazy` supports named exports out of the box:
>
> ```ts
> import { lazy } from 'solid-js'
> const MyComponent = lazy(() => import('./MyComponent'), { export: 'MyComponent' })
> ```
>
> solidjs-lazily still saves you from repeating the export name, but it's now a convenience, not a necessity. See [Do you need it with Solid 2.0?](#do-you-need-it-with-solid-20)

## Versions

| Solid version | solidjs-lazily version |
| ------------- | ---------------------- |
| Solid 2.x     | 1.x                    |
| Solid 1.x     | 0.1.2                  |

If you're on Solid 1.x, install the last 0.x release:

```shell
npm install solidjs-lazily@0.1.2
```

Don't use 0.1.2 with Solid 2.0. It picks the named export at runtime, which Solid 2.0's `lazy` doesn't support during hydration.

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
const MyComponent = lazy(() => import('./MyComponent'), {
  export: 'MyComponent',
})
```

## Do you need it with Solid 2.0?

In Solid 1.x, `lazy` only worked with default exports, so a named export needed a workaround:

```ts
// Solid 1.x
const MyComponent = lazy(() =>
  import('./MyComponent').then((module) => ({ default: module.MyComponent }))
)
```

Solid 2.0 added the `export` option, so the built-in version is a one-liner:

```ts
// Solid 2.0
const MyComponent = lazy(() => import('./MyComponent'), {
  export: 'MyComponent',
})
```

With `solidjs-lazily`, you don't repeat the name, and you can pull several components out of one module in one line:

```ts
import { lazily } from 'solidjs-lazily'
const { Header, Footer } = lazily(() => import('./components'))
```

Under the hood that's exactly `lazy(loader, { export: 'Header' })` for each name, so you get the same `preload()` and hydration support as the built-in `lazy`.

Prefer the built-in `lazy` if you don't mind repeating the name, or if your bundler integration injects a `moduleUrl` into `lazy()` calls (used for islands). It can't do that through a wrapper.

### Migrating from solidjs-lazily 0.x (Solid 1.x)

The API is the same. Upgrade both packages together:

```shell
npm install solid-js@2 solidjs-lazily@1
```

Note that `Suspense` is called `Loading` in Solid 2.0. See the [Solid 2.0 migration guide](https://github.com/solidjs/solid/blob/main/documentation/solid-2.0/MIGRATION.md) for everything else that changed.

## Full example

```tsx
import { createSignal, Loading } from 'solid-js'
import { lazily } from 'solidjs-lazily'

const { MyComponent } = lazily(() => import('./MyComponent'))

const App = () => {
  const [open, setOpen] = createSignal(false)
  return (
    <>
      {open() ? (
        <Loading fallback={<>Loading...</>}>
          <MyComponent />
        </Loading>
      ) : (
        <button onClick={() => setOpen(true)}>Load</button>
      )}
    </>
  )
}
```

Every component returned by `lazily` has a `preload()` method, so you can start loading early:

```tsx
<button onMouseEnter={() => MyComponent.preload()}>Load</button>
```

For Solid 1.x and solidjs-lazily 0.1.2, use `Suspense` instead of `Loading`. See the [Solid 1 CodeSandbox example](https://codesandbox.io/s/solidjs-lazily-example-qvv3y).

## Related

- https://www.npmjs.com/package/react-lazily
