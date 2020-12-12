import SERVER_DATA from "data/all";
import Rpc from "Generate/Rpc";
import SendRpc from "Network/SendRpc";
import { models as towerModels } from "Entities/Tower";
import { models as harvesterModels } from "Entities/Harvester";
import { models as wallModels } from "Entities/Wall";
import { models as doorModels } from "Entities/Door";
import { models as goldStashModels } from "Entities/GoldStash";
import { models as goldMineModels } from "Entities/GoldMine";
import { models as slowTrapModels } from "Entities/SlowTrap";
import Util from "Util/Util";

const models = [
  ...towerModels,
  ...harvesterModels,
  ...wallModels,
  ...doorModels,
  ...goldStashModels,
  ...goldMineModels,
  ...slowTrapModels
];

const entities = SERVER_DATA.ENTITIES;
const parties = SERVER_DATA.PARTIES;
const clients = SERVER_DATA.CLIENTS;
const requestsData = SERVER_DATA.REQUESTS;
const config = Util.loadConfig();

const partyApplicantDecide = new Rpc("PartyApplicantDecide", function (socket, data) {
  const { applicantUid, accepted } = data;
  const me = entities[socket.uid];
  const player = entities[applicantUid];
  const requests = requestsData[applicantUid];

  if (!applicantUid || !accepted || !player || !requests) return;

  for (const client of clients) {
    if (client.uid === applicantUid && accepted && requests.indexOf(entities[socket.uid].partyId) >= 0 && parties[me.partyId].members.length < config["max_players_per_party"]) {
      const party = parties[me.partyId];

      party.addMember(player, 0, 0);
      party.update();

      SendRpc(client, "PartyInfo", party.members);
      SendRpc(client, "PartyShareKey", {
        partyShareKey: party.partyShareKey
      });

      const buildings = [];

      Object.keys(entities).forEach(uid => {
        const building = entities[uid];

        if (models.indexOf(building.model) >= 0 && building.partyId == party.partyId) {
          buildings.push({
            x: building.position.x,
            y: building.position.y,
            type: building.model,
            dead: building.dead,
            uid: building.uid,
            tier: building.tier
          });
        }
      });

      SendRpc(client, "LocalBuilding", buildings);
    } else if (!accepted && client.uid === applicantUid) {
      SendRpc(client, "PartyApplicantDenied", {});
    }
  }
});

export default partyApplicantDecide;
