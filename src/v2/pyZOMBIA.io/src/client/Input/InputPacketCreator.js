import EventEmitter from "events";
import Game from "Game/Game";

class InputPacketCreator extends EventEmitter {
  scheduler = Game.currentGame.inputPacketScheduler;

  start() {
    this.bindKeys();
    this.bindMouse();
  }

  bindKeys() {
    Game.currentGame.inputManager.on("keyPress", e => {
      switch (e.keyCode) {
        case 38:
        case 90:
          this.scheduler.scheduleInput({
            up: 1,
            down: 0
          });
          break;
        case 40:
        case 83:
          this.scheduler.scheduleInput({
            up: 0,
            down: 1
          });
          break;
        case 37:
        case 81:
          this.scheduler.scheduleInput({
            left: 1,
            right: 0
          });
          break;
        case 39:
        case 68:
          this.scheduler.scheduleInput({
            left: 0,
            right: 1
          });
          break;
      }
    });

    Game.currentGame.inputManager.on("keyRelease", e => {
      switch (e.keyCode) {
        case 38:
        case 90:
          this.scheduler.scheduleInput({
            up: 0
          });
          break;
        case 40:
        case 83:
          this.scheduler.scheduleInput({
            down: 0
          });
          break;
        case 37:
        case 81:
          this.scheduler.scheduleInput({
            left: 0
          });
          break;
        case 39:
        case 68:
          this.scheduler.scheduleInput({
            right: 0
          });
          break;
      }
    });
  }

  bindMouse() { }
}

export default InputPacketCreator;

