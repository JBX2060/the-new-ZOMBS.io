import SERVER_DATA from "data/all";
import PacketIds from "Network/PacketIds";
import Util from "Util/Util";
import * as msgpack from "@msgpack/msgpack";

const config = Util.loadConfig();

function SendEnterWorld({
  player,
  socket,
  full
}) {
  if (socket && socket.readyState !== socket.OPEN) return;

  const channels = ["Local", "Party"];
  if (config["allow_global_chat"]) {
    channels.push("Global");
  }

  let ret;
  if (full) {
    ret = {
      allowed: 0
    }
  } else {
    ret = {
      allowed: 1,
      uid: player.uid,
      startingTick: SERVER_DATA.TICK,
      tickRate: 20,
      effectiveTickRate: 20,
      players: SERVER_DATA.CLIENTS.length,
      maxPlayers: SERVER_DATA.MAX_PLAYERS,
      effectiveDisplayName: player.name,
      width: SERVER_DATA.MAP.width,
      height: SERVER_DATA.MAP.height,
      availableChatChannels: channels,
      timeBetweenNights: config["time_between_nights"]
    }
  }

  socket.send(msgpack.encode({
    opcode: PacketIds.PACKET_ENTER_WORLD,
    ...ret
  }));

  if (full) {
    socket.close();
  }
}

export default SendEnterWorld;
