const test = require('tape');

const fromFunction = require('./index');
const makeMock = require('callbag-mock');

test('it emits function return values until unsub', t => {

  let received = [];
  const report = (name,dir,t,d) => t === 1 && received.push(d);
  const sink = makeMock('sink', report);

  const logic = (...args) => args.join('-');
  const {source, emitter} = fromFunction(logic);

  emitter('foo'); // won't be received since we're not subscribed yet

  source(0, sink); // start subscription

  emitter('bar', 456);
  emitter('baz', 7, 8, 9);

  sink.emit(2); // stop subscription

  emitter('bin'); // won't be received since we stopped subscribing

  t.deepEqual(received, ['bar-456', 'baz-7-8-9'], 'all return values are emitted');

  t.end();
});

test('the emitter passes on the return value', t => {
  const {source, emitter} = fromFunction(() => 'foo');
  t.equal(emitter(), 'foo', 'return value is passed along');
  t.end();
});
