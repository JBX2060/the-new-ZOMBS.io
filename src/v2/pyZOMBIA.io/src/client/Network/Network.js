import Debugger from "debug";
import EventEmitter from "events";
import * as msgpack from "@msgpack/msgpack";
import PacketIds from "Network/PacketIds";

class BinNetworkAdapter extends EventEmitter {
  inWorld = false;
  connected = false;
  connecting = false;

  constructor() {
    super();

    this.debug = new Debugger("Game/BinNetworkAdapter");
  }

  connect(server) {
    this.connecting = true;
    this.protocol = window.location.protocol === "https" ? "wss" : "ws";

    this.socket = new WebSocket(`${this.protocol}://${server.hostname}:${server.port}`);
    this.socket.binaryType = "arraybuffer";

    this.bindEventListeners();

    this.on("connected", () => {
      this.connected = true;
      this.connecting = false;
    });

    this.on("close", e => {
      this.connected = false;
      this.connecting = false;
    });
  }

  bindEventListeners() {
    this.socket.addEventListener("open", this.emit.bind(this, "connected"));
    this.socket.addEventListener("message", this.onMessage.bind(this));
    this.socket.addEventListener("error", this.emit.bind(this, "error"));
    this.socket.addEventListener("close", this.emit.bind(this, "close"));
  }

  sendEnterWorld(displayName) {
    this.socket.send(msgpack.encode({
      opcode: PacketIds.PACKET_ENTER_WORLD,
      displayName
    }));
  }

  sendInput(input) {
    this.socket.send(msgpack.encode({
      opcode: PacketIds.PACKET_INPUT,
      ...input
    }));
  }

  addRpcHandler(name, handler) {
    this.on(PacketIds.PACKET_RPC, response => {
      if (response.name === name) {
        handler();
      }
    });
  }

  addPingHandler(handler) {
    this.on(PacketIds.PACKET_PING, handler);
  }

  addEnterWorldHandler(handler) {
    this.on(PacketIds.PACKET_ENTER_WORLD, handler);
  }

  addEntityUpdateHandler(handler) {
    this.on(PacketIds.PACKET_ENTITY_UPDATE, handler);
  }

  getPing() {
    return 0;
  }

  onMessage({ data }) {
    const message = msgpack.decode(data);
    this.emit(message.opcode, message);
  }
}

export default BinNetworkAdapter;
