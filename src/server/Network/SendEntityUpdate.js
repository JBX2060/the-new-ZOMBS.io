import SERVER_DATA from "data/all";
import PacketIds from "Network/PacketIds";
import * as msgpack from "@msgpack/msgpack";

function SendEntityUpdate({
  entities,
  socket
}) {
  if (socket && socket.readyState !== socket.OPEN) return;

  socket.send(msgpack.encode({
    opcode: PacketIds.PACKET_ENTITY_UPDATE,
    tick: SERVER_DATA.TICK,
    entities
  }));
}

export default SendEntityUpdate;
