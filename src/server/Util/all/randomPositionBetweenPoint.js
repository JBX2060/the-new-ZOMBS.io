import Util from "Util/Util";

function randomPositionBetweenPoint(point, range = 300) {
  return {
    x: Util.randomIntFromInterval(point.x - range, point.x + range),
    y: Util.randomIntFromInterval(point.y - range, point.y + range)
  }
}

export default randomPositionBetweenPoint;
