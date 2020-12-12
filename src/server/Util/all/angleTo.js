function angleTo(xFrom, yFrom, xTo, yTo) {
  var dx = xTo - xFrom;
  var dy = yTo - yFrom;
  var yaw = Math.atan2(dy, dx) * 180.0 / Math.PI;
  var nonZeroYaw = yaw + 180.0;
  var reversedYaw = nonZeroYaw;
  var shiftedYaw = (360.0 + reversedYaw - 90.0) % 360.0;
  return shiftedYaw;
}

export default angleTo;
