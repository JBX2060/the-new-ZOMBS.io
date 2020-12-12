import PacketIds from "Network/PacketIds";
import * as msgpack from "@msgpack/msgpack";

function SendRpc(
  socket,
  name,
  response
) {
  if (socket && socket.readyState !== socket.OPEN) return;

  socket.send(msgpack.encode({
    opcode: PacketIds.PACKET_RPC,
    name,
    response
  }));
}

export default SendRpc;
