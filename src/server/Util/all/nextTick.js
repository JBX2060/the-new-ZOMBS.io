import SERVER_DATA from "data/all";
import Util from "Util/Util";

function nextTick(callback) {
  if (!Util.tickCallbacks) Util.tickCallbacks = [];

  Util.tickCallbacks.push({
    tick: SERVER_DATA.TICK + 2,
    callback
  });
}

export default nextTick;
