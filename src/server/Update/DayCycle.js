import SERVER_DATA from "data/all";
import SendRpc from "Network/SendRpc";
import SpawnZombies from "Spawner/SpawnZombies";
import Util from "Util/Util";

const config = Util.loadConfig();

function UpdateDayCycle() {
  const data = SERVER_DATA.DAY_CYCLE_DATA;
  const parties = SERVER_DATA.PARTIES;
  const clients = SERVER_DATA.CLIENTS;
  const entities = SERVER_DATA.ENTITIES;

  data.isDay = Number(!data.isDay);
  data.cycleStartTick = SERVER_DATA.TICK;

  if (data.isDay) {
    data.nightEndTick = 0;
    data.dayEndTick = SERVER_DATA.TICK + (config["time_between_nights"] / 50);
  } else {
    data.dayEndTick = 0;
    data.nightEndTick = SERVER_DATA.TICK + (config["time_between_nights"] / 50);

    parties.forEach(party => {
      if (party.goldStash) {
        party.wave++;

        Object.keys(entities).forEach(uid => {
          const entity = entities[uid];

          if (entity.model == "GamePlayer" && entity.partyId == party.partyId)
            entity.wave = party.wave;
        });

        SpawnZombies(party.goldStash);
      }
    });
  }

  clients.forEach(socket => {
    SendRpc(socket, "DayCycle", data);
  });
}

export default UpdateDayCycle;

