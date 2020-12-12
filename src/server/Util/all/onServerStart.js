import Util from "Util/Util";

function onServerStart(callback) {
  // Waiting 5 ticks to make sure every entity
  // (trees, stones, etc..) have spawned.

  Util.waitTicks(5).then(callback);
}

export default onServerStart;
