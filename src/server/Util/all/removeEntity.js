import SERVER_DATA from "data/all";

function removeEntity(uid) {
  const entities = SERVER_DATA.ENTITIES;
  const entity = entities[uid];

  if (entity) {
    entities[uid].delete();
    delete entities[uid];
  }
}

export default removeEntity;
