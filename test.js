const test = require('tape');

const fromFunction = require('./index');
const makeMock = require('callbag-mock');

test('it emits function return values until unsub', t => {

  let received = [];
  const report = (name,dir,t,d) => t === 1 && received.push(d);
  const sink = makeMock('sink', report);

  const identity = a => a;
  const {source, emitter} = fromFunction(identity);

  emitter('foo'); // won't be received since we're not subscribed yet

  source(0, sink); // start subscription

  emitter('bar');
  emitter('baz');

  sink.emit(2); // stop subscription

  emitter('bin'); // won't be received since we stopped subscribing

  t.deepEqual(received, ['bar', 'baz'], 'all return values are emitted');

  t.end();
});
