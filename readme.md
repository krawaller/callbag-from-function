# callbag-from-function

Generate a [Callbag](https://github.com/callbag/callbag) from a function. Whenever the function is called, the source will emit what the function returned.

`npm install callbag-from-function`

## usage

```
const {source, emitter, finish} = fromFunction(someFunc);
```

Now, whenever you call `emitter` with some `...args`, `source` will emit what `someFunc` returns when called with `...args`.

The `emitter` will also return the emitted value.

If no function is passed in, an `identity` function will be used.

The `source` is "hot" (using [callbag-share](https://github.com/staltz/callbag-share)), meaning it can take many listeners.

If you want to end the callbag-from-function use `finish` function.

## example

Wrapping an action creator in an app with a state stream.

```js
const forEach = require('callbag-for-each');
const fromFunction = require('callbag-from-function');

const newName = str => ({type: 'NEWNAME', value: str});

const {source: newName$, emitter: wrappedNewName} = fromFunction(newName);

forEach(a => console.log("New name:", a.value))(newName$);

wrappedNewName("Batman"); // New name: Batman
```

We get the latest name, 'New name: Batman', when we call finish function.

```js
const fromFunction = require('callbag-from-function');
const {pipe, forEach} = require('callbag-basics');
const last = require('callbag-last');

const newName = str => ({type: 'NEWNAME', value: str});

const {
    source: newName$,
    emitter: wrappedNewName,
    finish
} = fromFunction(newName);

const source = pipe(
    newName$,
    last(),
    forEach(val => console.log("New name:", val.value))
);

wrappedNewName("Robin");
wrappedNewName("Batman"); // New name: Batman

finish();
```
