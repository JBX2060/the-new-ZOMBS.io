import Game from "Engine/Game/Game";
import NetworkAdapter from "Engine/Network/NetworkAdapter";
import BinCodec from "Engine/Network/BinCodec";
import PacketIds from "Engine/Network/PacketIds";
import Debug from "debug";

const debug = Debug('Engine:Network/BinNetworkAdapter');

class BinNetworkAdapter extends NetworkAdapter {
  constructor() {
    super();

    this.pingStart = null;
    this.pingCompletion = null;
    this.ping = 0;
    this.connected = false;
    this.connecting = false;
    this.codec = new BinCodec();
    this.addConnectHandler(this.sendPingIfNecessary.bind(this));
    this.addPingHandler(this.onPing.bind(this));
    this.emitter.on('connected', event => {
      debug('Successfully connected to Websocket: ', event);
      this.connecting = false;
      this.connected = true;
    });
    this.emitter.on('close', event => {
      debug('Websocket connection has been closed: ', event);
      this.connecting = false;
      this.connected = false;
      if (Game.currentGame.world.getInWorld()) {
        setTimeout(this.reconnect.bind(this), 1000);
      }
      else if (!Game.currentGame.world.getInWorld() && this.connectionOptions.fallbackPort) {
        var fallbackPort = this.connectionOptions.fallbackPort;
        delete this.connectionOptions.fallbackPort;
        debug('Switching to fallback port: %d', fallbackPort);
        this.connectionOptions.port = fallbackPort;
        this.reconnect();
      }
    });
    return this;
  }
  connect(options) {
    if (this.connecting || this.connected) {
      return;
    }
    this.connectionOptions = options;
    this.connected = false;
    this.connecting = true;
    if (window.location.protocol === 'https:') {
      this.socket = new WebSocket('wss://' + options.hostname + ':' + options.port + (process.env.PRODUCTION ? "/s" : ""));
    }
    else {
      this.socket = new WebSocket('ws://' + options.hostname + ':' + options.port + (process.env.PRODUCTION ? "/s" : ""));
    }
    this.socket.binaryType = 'arraybuffer';
    debug('Connecting socket: ', this.socket);
    this.bindEventListeners();
  }
  bindEventListeners() {
    this.socket.addEventListener('open', this.emitter.emit.bind(this.emitter, 'connected'));
    this.socket.addEventListener('message', this.onMessage.bind(this));
    this.socket.addEventListener('close', this.emitter.emit.bind(this.emitter, 'close'));
    this.socket.addEventListener('error', this.emitter.emit.bind(this.emitter, 'error'));
  }
  disconnect() {
    this.socket.close();
  }
  reconnect() {
    debug('Attempting to reconnect...', this.connectionOptions);
    return this.connect(this.connectionOptions);
  }
  getPing() {
    return this.ping;
  }
  sendPacket(event, data) {
    if (!this.connected) {
      return;
    }
    this.socket.send(this.codec.encode(event, data));
  }
  onMessage(event) {
    this.sendPingIfNecessary();
    var message = this.codec.decode(event.data);
    this.emitter.emit(PacketIds[message.opcode], message);
  }
  sendPingIfNecessary() {
    this.connecting = false;
    this.connected = true;
    var pingInProgress = (this.pingStart != null);
    if (pingInProgress) {
      return;
    }
    if (this.pingCompletion != null) {
      var msSinceLastPing = (new Date().getTime() - this.pingCompletion.getTime());
      if (msSinceLastPing <= 5000) {
        return;
      }
    }
    this.pingStart = new Date();
    this.sendPing({ nonce: 0 });
  }
  onPing() {
    var now = new Date();
    this.ping = (now.getTime() - this.pingStart.getTime()) / 2;
    this.pingStart = null;
    this.pingCompletion = now;
  }
}

export default BinNetworkAdapter;
