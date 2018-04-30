# callbag-from-function

Generate a [Callbag](https://github.com/callbag/callbag) from a function. Whenever the function is called, the source will emit what the function returned.

`npm install callbag-from-function`

## usage

```
const {source, emitter} = fromFunction(someFunc);
```

Now, whenever you call `emitter` with some `...args`, `source` will emit what `someFunc` returns when called with `...args`.

The `emitter` will also return the emitted value.


## example

Wrapping an action creator in an app with a state stream.

```js
const forEach = require('callbag-for-each');
const fromFunction = require('callbag-from-function');

const newName = str => ({type: 'NEWNAME', value: str});

const {source: newName$, emitter: wrappedNewName} = fromFunction(newName);

const forEach(newName$)(a => console.log("New name:", a.value));

wrappedNewName("Batman"); // New name: Batman
```
