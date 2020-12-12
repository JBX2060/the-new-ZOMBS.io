import SERVER_DATA from "data/all";
import SendRpc from "Network/SendRpc";
import SendEnterWorld from "Network/SendEnterWorld";
import GamePlayer from "Entities/GamePlayer";
import Party from "Party/Party";
import Util from "Util/Util";

const config = Util.loadConfig();
const parties = SERVER_DATA.PARTIES;
const clients = SERVER_DATA.CLIENTS;
const entities = SERVER_DATA.ENTITIES;
const leaderboard = SERVER_DATA.LEADERBOARD;
const dayCycle = SERVER_DATA.DAY_CYCLE_DATA;

function HandlePacketEnterWorld(socket, data) {
  if (socket.inWorld) {
    return;
  }

  if (SERVER_DATA.PLAYER_COUNT >= SERVER_DATA.MAX_PLAYERS) {
    SendEnterWorld({
      player,
      socket,
      full: true
    });
    return;
  }

  SERVER_DATA.PLAYER_COUNT++;
  socket.inWorld = true;

  const party = new Party();
  const player = new GamePlayer({
    name: data.displayName || config["default_nickname"],
    position: Util.randomPositionOnMap(),
    partyId: party.partyId
  });

  if (config["god_mode"]) {
    // As, when god mode is enabled,
    // you get maximum resource amount
    // possible, you won't get any more
    // when you farm

    player.gold = Number.MAX_SAFE_INTEGER;
    player.wood = Number.MAX_SAFE_INTEGER;
    player.stone = Number.MAX_SAFE_INTEGER;
    player.token = Number.MAX_SAFE_INTEGER;
  }

  party.addMember(player, 1, 1);

  SendEnterWorld({
    player,
    socket
  });

  clients.push(socket);
  entities[player.uid] = player;
  socket.uid = player.uid;

  socket.currentItem = "Pickaxe";
  socket.tools = {
    "Pickaxe": {
      itemName: "Pickaxe",
      tier: 1
    },
    "PetWhistle": {
      itemName: "PetWhistle",
      tier: 1
    }
  };

  for (const i of Object.keys(socket.tools)) {
    const item = socket.tools[i];
    SendRpc(socket, "SetItem", {
      itemName: item.itemName,
      tier: item.tier,
      stacks: 1
    });
  }

  SendRpc(socket, "Leaderboard", leaderboard);
  SendRpc(socket, "DayCycle", dayCycle);
  SendRpc(socket, "PartyInfo", party.members);
  SendRpc(socket, "PartyShareKey", {
    partyShareKey: party.partyShareKey
  });

  for (const id in parties) {
    SendRpc(socket, "AddParty", {
      partyId: parties[id].partyId,
      partyName: parties[id].partyName,
      isOpen: parties[id].isOpen,
      memberCount: parties[id].memberCount
    });
  }
}

export default HandlePacketEnterWorld;
