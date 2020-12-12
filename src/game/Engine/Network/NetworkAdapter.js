import PacketIds from "Engine/Network/PacketIds";
import EventEmitter from "events";

class NetworkAdapter {
  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(50);
  }
  sendEnterWorld(data) {
    this.sendPacket(PacketIds.PACKET_ENTER_WORLD, data);
  }
  sendInput(data) {
    this.sendPacket(PacketIds.PACKET_INPUT, data);
  }
  sendPing(data) {
    this.sendPacket(PacketIds.PACKET_PING, data);
  }
  sendRpc(data) {
    this.sendPacket(PacketIds.PACKET_RPC, data);
  }
  addEnterWorldHandler(callback) {
    this.addPacketHandler(PacketIds.PACKET_ENTER_WORLD, function (response) {
      callback(response);
    });
  }
  addEntityUpdateHandler(callback) {
    this.addPacketHandler(PacketIds.PACKET_ENTITY_UPDATE, function (response) {
      callback(response);
    });
  }
  addPingHandler(callback) {
    this.addPacketHandler(PacketIds.PACKET_PING, function (response) {
      callback(response);
    });
  }
  addRpcHandler(name, callback) {
    this.addPacketHandler(PacketIds.PACKET_RPC, function (response) {
      if (name == response.name) {
        callback(response.response);
      }
    });
  }
  addConnectHandler(callback) {
    this.emitter.on('connected', callback);
  }
  addCloseHandler(callback) {
    this.emitter.on('close', callback);
  }
  addErrorHandler(callback) {
    this.emitter.on('error', callback);
  }
  addPacketHandler(event, callback) {
    this.emitter.on(PacketIds[event], callback);
  }
}

export default NetworkAdapter;
