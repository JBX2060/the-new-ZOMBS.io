import SERVER_DATA from "data/all";
import Util from "Util/Util";

async function waitNextTick() {
  if (!Util.tickCallbacks) Util.tickCallbacks = [];

  return new Promise((resolve, reject) =>
    Util.tickCallbacks.push({
      tick: SERVER_DATA.TICK + 1,
      callback: resolve
    }));
}

export default waitNextTick;
