import PacketIds from "Engine/Network/PacketIds";
import ParameterType from "Engine/Network/ParameterType";
import * as msgpack from "@msgpack/msgpack";
import "text-encoding-polyfill";

class BinCodec {
  constructor() {
  }
  encode(name, item) {
    switch (name) {
      case PacketIds.PACKET_ENTER_WORLD:
        return this.encodeEnterWorld(item);
      case PacketIds.PACKET_INPUT:
        return this.encodeInput(item);
      case PacketIds.PACKET_PING:
        return this.encodePing(item);
      case PacketIds.PACKET_RPC:
        return this.encodeRpc(item);
    }
  }
  decode(data) {
    const response = msgpack.decode(data);

    switch (response.opcode) {
      case PacketIds.PACKET_ENTER_WORLD:
        return this.decodeEnterWorldResponse(response);
      case PacketIds.PACKET_ENTITY_UPDATE:
        return this.decodeEntityUpdate(response);
      case PacketIds.PACKET_PING:
        return this.decodePing(response);
      case PacketIds.PACKET_RPC:
        return this.decodeRpc(response);
    }
  }
  decodeEnterWorldResponse(data) {
    return data;
  }
  decodeEntityUpdate(data) {
    const entityUpdateData = {};

    entityUpdateData.tick = data.tick;
    entityUpdateData.entities = data.entities;
    entityUpdateData.opcode = data.opcode;

    return entityUpdateData;
  }
  decodePing(buffer) {
    return {};
  }
  encodeRpc(data) {
    return msgpack.encode({
      opcode: PacketIds.PACKET_RPC,
      ...data
    })
  }
  decodeRpc(data) {
    return data;
  }
  encodeEnterWorld(item) {
    return msgpack.encode({
      opcode: PacketIds.PACKET_ENTER_WORLD,
      ...item
    });
  }
  encodeInput(item) {
    return msgpack.encode({
      opcode: PacketIds.PACKET_INPUT,
      ...item
    });
  }
  encodePing(item) {
    return msgpack.encode({
      opcode: PacketIds.PACKET_PING,
      ...item
    });
  }
}

export default BinCodec;
