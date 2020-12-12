import SERVER_DATA from "data/all";
import SendRpc from "Network/SendRpc";

function isOccupied(socket, cellIndex, cellPos, buildingId, goldStash) {
  var cellSize = 48;
  var entities = SERVER_DATA.ENTITY_GRID.getEntitiesInCell(cellIndex);
  var gridPos = {
    x: cellPos.x * cellSize + cellSize / 2,
    y: cellPos.y * cellSize + cellSize / 2
  };
  if (!entities) {
    return true;
  }
  var buildings = 0;
  for (var uid in entities) {
    var networkEntity = SERVER_DATA.ENTITIES[uid];
    if (!networkEntity) {
      continue;
    }
    buildings += networkEntity.entityClass !== 'Projectile' ? 1 : 0;
  }
  if (buildings > 0) {
    SendRpc(socket, "Failure", {
      category: "Placement",
      reason: "ObstructionsArePresent"
    });
    return true;
  }
  var wallDistanceX = Math.min(cellPos.x, SERVER_DATA.ENTITY_GRID.getColumns() - 1 - cellPos.x);
  var wallDistanceY = Math.min(cellPos.y, SERVER_DATA.ENTITY_GRID.getRows() - 1 - cellPos.y);
  if (wallDistanceX < SERVER_DATA.MIN_WALL_DISTANCE || wallDistanceY < SERVER_DATA.MIN_WALL_DISTANCE) {
    SendRpc(socket, "Failure", {
      category: "Placement",
      reason: "TooCloseToEdge"
    });
    return true;
  }
  var localPlayer = SERVER_DATA.ENTITIES[socket.uid];
  if (localPlayer) {
    var cellDistanceX = Math.abs(localPlayer.position.x - gridPos.x) / cellSize;
    var cellDistanceY = Math.abs(localPlayer.position.y - gridPos.y) / cellSize;
    if (cellDistanceX > SERVER_DATA.MAX_PLAYER_DISTANCE || cellDistanceY > SERVER_DATA.MAX_PLAYER_DISTANCE) {
      SendRpc(socket, "Failure", {
        category: "Placement",
        reason: "TooFarFromLocalPosition"
      });
      return true;
    }
  }
  if (goldStash && buildingId !== 'Harvester') {
    var cellDistanceX = Math.abs(goldStash.position.x - gridPos.x) / cellSize;
    var cellDistanceY = Math.abs(goldStash.position.y - gridPos.y) / cellSize;
    if (cellDistanceX > SERVER_DATA.MAX_STASH_DISTANCE || cellDistanceY > SERVER_DATA.MAX_STASH_DISTANCE) {
      SendRpc(socket, "Failure", {
        category: "Placement",
        reason: "TooFarFromStash"
      });
      return true;
    }
  }
  return false;
}

export default isOccupied;
