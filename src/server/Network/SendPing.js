import PacketIds from "Network/PacketIds";
import * as msgpack from "@msgpack/msgpack";

function SendPing(
  socket,
) {
  if (socket && socket.readyState !== socket.OPEN) return;

  socket.send(msgpack.encode({
    opcode: PacketIds.PACKET_PING
  }));
}

export default SendPing;
