import { Source } from 'callbag';


function fromFunction<T = any>(): {emitter: {(a:T):T}, source: Source<T>};
function fromFunction<T, U extends any[]>(func: {(...args: U):T}): {emitter: {(...args: U):T}, source: Source<T>};

export default fromFunction;