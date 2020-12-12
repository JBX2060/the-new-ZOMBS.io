import Game from "Engine/Game/Game";
import Stats from "stats-js";

class Debug {
  constructor() {
    this.visible = false;
    this.ticks = 0;
  }
  init() {
    var debugHtml = '<div id="hud-debug" class="hud-debug" style="position:fixed;top:112px;left:20px;color:#ff0000;font-family:sans-serif;"></div>';
    this.stats = new Stats();
    this.stats.domElement.style.position = 'fixed';
    this.stats.domElement.style.left = '20px';
    this.stats.domElement.style.top = '20px';
    this.stats.domElement.style.transform = 'scale(1.5)';
    this.stats.domElement.style.transformOrigin = 'top left';
    document.body.appendChild(this.stats.domElement);
    document.body.insertAdjacentHTML('beforeend', debugHtml);
    this.debugElem = document.getElementById('hud-debug');
    Game.currentGame.renderer.addTickCallback(this.onRendererTick.bind(this));
    Game.currentGame.inputManager.on('keyRelease', this.onKeyRelease.bind(this));
    this.stats.domElement.style.display = 'none';
    this.debugElem.style.display = 'none';
  }
  begin() {
    if (!this.stats || !this.visible) {
      return;
    }
    this.stats.begin();
  }
  end() {
    if (!this.stats || !this.visible) {
      return;
    }
    this.stats.end();
  }
  show() {
    this.visible = true;
    this.stats.domElement.style.display = 'block';
    this.debugElem.style.display = 'block';
  }
  hide() {
    this.visible = false;
    this.stats.domElement.style.display = 'none';
    this.debugElem.style.display = 'none';
  }
  onRendererTick() {
    this.ticks++;
    if (!this.visible) {
      return;
    }
    if (this.ticks % 20 !== 0) {
      return;
    }
    var text = 'Ping: ' + Game.currentGame.network.getPing() + ' ms<br>';
    var st = Game.currentGame.world.getReplicator().getServerTime();
    var ct = Game.currentGame.world.getReplicator().getClientTime();
    var rct = Game.currentGame.world.getReplicator().getRealClientTime();
    var stutters = Game.currentGame.world.getReplicator().getFrameStutters();
    var fps = Game.currentGame.world.getReplicator().getFps();
    var interpolating = Game.currentGame.world.getReplicator().getInterpolating();
    var tickEntities = Game.currentGame.world.getReplicator().getTickEntities();
    var local = Game.currentGame.world.getLocalPlayer();
    var pooledNetworkEntities = Game.currentGame.world.getPooledNetworkEntityCount();
    var extrapolations = Game.currentGame.metrics.getFramesExtrapolated();
    var resets = Game.currentGame.world.getReplicator().getClientTimeResets();
    var maxExtrapolationTime = Game.currentGame.world.getReplicator().getMaxExtrapolationTime();
    text = text + 'Server time: ' + st + ' ms<br>';
    text = text + 'Client time: ' + ct + ' ms<br>';
    text = text + 'Real client time: ' + rct + ' ms<br>';
    text = text + 'Client lag: ' + (st - ct) + ' ms<br>';
    text = text + 'Real client lag: ' + (st - rct) + ' ms<br>';
    text = text + 'Stutters: ' + stutters + '<br>';
    text = text + 'Frames extrapolated: ' + extrapolations + '<br>';
    text = text + 'Max extrapolation time: ' + maxExtrapolationTime + '<br>';
    text = text + 'Client time resets: ' + resets + '<br>';
    text = text + 'FPS: ' + Math.floor(fps) + '<br>';
    text = text + 'Interpolating: ' + interpolating + '<br>';
    text = text + 'Tick entities: ' + tickEntities + '<br>';
    text = text + 'Pooled network entities: ' + pooledNetworkEntities + '<br>';
    text = text + 'Pooled model entities:<br>';
    for (var modelName in Game.currentGame.getModelEntityPooling()) {
      text = text + '- ' + modelName + ': ' + Game.currentGame.world.getPooledModelEntityCount(modelName) + '<br>';
    }
    this.debugElem.innerHTML = text;
  }
  onKeyRelease(event) {
    var keyCode = event.keyCode;
    if (keyCode == 117) {
      if (this.visible) {
        this.hide();
      }
      else {
        this.show();
      }
    }
  }
}

export default Debug;
