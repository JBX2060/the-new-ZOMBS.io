import SERVER_DATA from "data/all";

function getNewPartyId() {
  return SERVER_DATA.PARTY_COUNT++;
}

export default getNewPartyId;
