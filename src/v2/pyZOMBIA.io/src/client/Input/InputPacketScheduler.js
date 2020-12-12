import Game from "Game/Game";

class InputPacketScheduler {
  currentInput = null;
  shouldSendInput = false;

  constructor() {
    Game.currentGame.renderer.addTickCallback(this.onTick.bind(this));
  }

  onTick(delta) {
    this.msElapsedSinceLastInputSent += delta;
    this.sendInput();
  }

  sendInput() {
    if (this.msElapsedSinceLastInputSent < 50) return;
    if (!this.shouldSendInput) return;

    Game.currentGame.network.sendInput(this.currentInput);

    this.shouldSendInput = false;
    this.currentInput = null;
  }

  scheduleInput(input) {
    this.shouldSendInput = true;
    this.currentInput = input;
    this.sendInput();
  }
}

export default InputPacketScheduler;
