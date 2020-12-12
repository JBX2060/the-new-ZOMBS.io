import Util from "Util/Util";

class Ticker {
  constructor(tickRate, callback) {
    this.start(tickRate, callback);

    Util.tickCallbacks = Util.tickCallbacks || [];
  }

  start(tickRate, callback) {
    this.i = 0;

    this.interval = setInterval(() => {
      for (let i in Util.tickCallbacks) {
        if (Util.tickCallbacks[i].tick == this.i) {
          Util.tickCallbacks[i].callback(this.i);
          delete Util.tickCallbacks[i];
        }
      }

      callback(this.i++);
    }, tickRate);

    this.tickRate = tickRate;
    this.callback = callback;
  }

  resume() {
    this.start(this.tickRate, this.callback);
  }

  stop() {
    clearInterval(this.interval);
  }
}

export default Ticker;
