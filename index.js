module.exports = function fromFunction(func) {

  let listenerTalkback;

  const source = (t, d) => {
    if (t !== 0) return;
    listenerTalkback = d;
    listenerTalkback(0, (st, sd) => {
      if (st === 2) {
        listenerTalkback = undefined;
      }
    });
  };

  const emitter = function(...args){
    if (listenerTalkback){
      listenerTalkback(1, func(...args));
    }
  };

  return {source, emitter};
}
