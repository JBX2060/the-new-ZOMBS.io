import SERVER_DATA from "data/all";
import Util from "Util/Util";

function waitTicks(ticks) {
  if (!Util.tickCallbacks) Util.tickCallbacks = [];

  return new Promise((resolve, reject) =>
    Util.tickCallbacks.push({
      tick: (SERVER_DATA.TICK || 0) + ticks,
      callback: resolve
    }));
}

export default waitTicks;
