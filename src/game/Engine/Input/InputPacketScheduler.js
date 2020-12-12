import Game from "Engine/Game/Game";

class InputPacketScheduler {
  constructor() {
    this.msElapsedSinceInputSent = 0;
    this.currentPacket = {};
    this.shouldSendPacket = false;
  }
  start() {
    Game.currentGame.renderer.addTickCallback(this.onRendererTick.bind(this));
  }
  scheduleInput(data) {
    this.currentPacket = data;
    this.shouldSendPacket = true;
    this.sendInputKeys();
  }
  onRendererTick(delta) {
    this.msElapsedSinceInputSent += delta;
    this.sendInputKeys();
  }
  sendInputKeys() {
    var msPerTick = Game.currentGame.world.getMsPerTick();
    if (this.msElapsedSinceInputSent < msPerTick) {
      return;
    }
    if (!this.shouldSendPacket) {
      return;
    }
    Game.currentGame.network.sendInput(this.currentPacket);
    this.currentPacket = null;
    this.shouldSendPacket = false;
  }
}

export default InputPacketScheduler;
