import SERVER_DATA from "data/all";

function updateEntityGrid(building) {
  SERVER_DATA.ENTITY_GRID.updateEntity({
    getTargetTick() {
      return building;
    },
    getPositionX() {
      return building.position.x;
    },
    getPositionY() {
      return building.position.y;
    },
    uid: building.uid
  });
}

export default updateEntityGrid;
