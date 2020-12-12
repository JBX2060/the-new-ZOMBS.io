import SERVER_DATA from "data/all";
import Util from "Util/Util";

function randomPositionOnMap() {
  return Util.randomPosition(SERVER_DATA.MAP);
}

export default randomPositionOnMap;
