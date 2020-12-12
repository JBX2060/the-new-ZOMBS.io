import SERVER_DATA from "data/all";

function getNewUid() {
  return SERVER_DATA.ENTITY_COUNT++;
}

export default getNewUid;
