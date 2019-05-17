# Bemto core

This is an ongoing dev version, do not use in your projects unless you really know what you're doing, thanks.

## Install

```sh
npm install @bemto/core
```

```sh
yarn add @bemto/core
```

## Basic Usage

In the most basic form, bemto accepts a list of “props”, and returns an object containing a `getProps` function that then could be used to access the resulting props for the block itself and for all the elements.

``` js
import bemto from '@bemto/core'

// Imagine we have `props` with some props
const { getProps } = bemto(props);

getProps(); // would return a list of props for the root element.
getProps('__Content'); // would return a list of props for the Content element.
```

If you'd want to use bemto in a JSX-like context, you can use this method alongside object spread to retrieve all the needed props for your HTML elements:

``` jsx
<div {...getProps()}>
  <div {...getProps('__Content')}>
    …
  </div>
</div>
```
