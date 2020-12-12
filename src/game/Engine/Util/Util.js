import Game from "Engine/Game/Game";

class Util {
  static checkedIfMobile = false;
  static actuallyIsMobile = false;

  static lerp(start, end, ratio) {
    if (ratio > 1.2) {
      ratio = 1;
    }
    return start + (end - start) * ratio;
  };
  static mod(a, b) {
    return (a % b + b) % b;
  };
  static interpolateYaw(target, from) {
    var tickPercent = Game.currentGame.world.getReplicator().getMsInThisTick() / Game.currentGame.world.getMsPerTick();
    var rotationalDifference = target - from;
    rotationalDifference = Util.mod(rotationalDifference + 180, 360) - 180;
    rotationalDifference = Util.lerp(0, rotationalDifference, tickPercent);
    var yaw = from + rotationalDifference;
    if (yaw < 0) {
      yaw += 360;
    }
    if (yaw >= 360) {
      yaw -= 360;
    }
    return yaw;
  };
  static angleTo(xFrom, yFrom, xTo, yTo) {
    var dx = xTo - xFrom;
    var dy = yTo - yFrom;
    var yaw = Math.atan2(dy, dx) * 180.0 / Math.PI;
    var nonZeroYaw = yaw + 180.0;
    var reversedYaw = nonZeroYaw;
    var shiftedYaw = (360.0 + reversedYaw - 90.0) % 360.0;
    return shiftedYaw;
  };
  static isMobile() {
    if (!Util.checkedIfMobile) {
      Util.actuallyIsMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      Util.checkedIfMobile = true;
    }
    return Util.actuallyIsMobile;
  };
}

export default Util;
