const test = require('tape');

const fromFunction = require('.');
const makeMock = require('callbag-mock');
const last = require('callbag-last');

test('it emits function return values until unsub', t => {
  const sink = makeMock();
  const {source, emitter} = fromFunction((...args) => args.join('-'));
  emitter('foo'); // won't be received since we're not subscribed yet
  source(0, sink); // start subscription
  emitter('bar', 456);
  emitter('baz', 7, 8, 9);
  sink.emit(2); // stop subscription
  emitter('bin'); // won't be received since we stopped subscribing
  t.deepEqual(
    sink.getReceivedData(),
    ['bar-456', 'baz-7-8-9'], 'all return values are emitted'
  );
  t.end();
});

test('the emitter passes on the return value', t => {
  const {source, emitter} = fromFunction(() => 'foo');
  t.equal(emitter(), 'foo', 'return value is passed along');
  t.end();
});

test('it should default to identity function', t => {
  const sink = makeMock();
  const {source, emitter} = fromFunction();
  source(0, sink);
  emitter('foo');
  t.deepEqual(sink.getReceivedData(), ['foo']);
  t.end();
});

test('the source should be shared', t => {
  let first, second;
  const sink1 = makeMock();
  const sink2 = makeMock();
  const {source, emitter} = fromFunction();
  source(0, sink1);
  source(0, sink2);
  emitter('stuff');
  t.deepEqual(sink1.getReceivedData(), ['stuff']);
  t.deepEqual(sink2.getReceivedData(), ['stuff']);
  t.end();
});

test('we can send finish signal to callbag-from-function', t => {
  const sink = makeMock();
  const {source, emitter, finish} = fromFunction();
  source(0, sink);
  emitter('foo');
  finish() // finish signal for the callbag-from-function
  emitter('mlk'); // won't be received since we finish the callbag-from-function
  t.deepEqual(sink.getReceivedData(), ['foo']);
  t.end();
});

test('we can finish and we get the last element', t => {
  const sink = makeMock();
  const {source, emitter, finish} = fromFunction();
  last()(source)(0, sink);
  emitter('have');
  emitter('a');
  emitter('good');
  emitter('day!');
  finish() // finish signal for the callbag-from-function
  emitter('mlk'); // won't be received since we finish the callbag-from-function
  t.deepEqual(sink.getReceivedData(), ['day!']);
  t.end();
});