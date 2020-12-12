import SERVER_DATA from "data/all";
import Util from "Util/Util";
import Physics from "Physics/Physics";

const entities = SERVER_DATA.ENTITIES;
const parties = SERVER_DATA.PARTIES;

function UpdateAllEntities() {
  Object.keys(entities).forEach(uid => {
    const entity = entities[uid];

    // Entity may have been deleted
    if (!entity) return;
    if (entity.partyId && !parties[entity.partyId])
      Util.removeEntity(entity.uid);
    if (entity.collision && !entities[entity.collision]) entity.collision = 0;

    entity.update();
    Physics.update(entity);
    Util.updateEntityGrid(entity);
  });
}

export default UpdateAllEntities;
