import SERVER_DATA from "data/all";
import Util from "Util/Util";

function findNearestEntityTo(entity, entities) {
  const distances = [];
  Object.keys(entities || SERVER_DATA.ENTITIES).forEach(uid => {
    const otherEntity = SERVER_DATA.ENTITIES[uid];
    const distance = Util.distance(entity, otherEntity);

    if (distance)
      distances.push([distance, uid]);
  });

  let [smallest] = distances;
  for (let i = 0; i < distances.length; i++) {
    if (distances[i][0] < smallest[0]) {
      smallest = distances[i];
    }
  }

  if (smallest)
    return (entities || SERVER_DATA.ENTITIES)[smallest[1]];
}

export default findNearestEntityTo;
