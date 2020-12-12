import Game from "Engine/Game/Game";
import Util from "Engine/Util/Util";
import Debug from "debug";

const debug = Debug('Engine:Metrics/Metrics');

class Metrics {
  constructor() {
    this.msElapsedSinceMetricsSent = 0;
    this.metrics = null;
    this.pingSum = 0;
    this.pingSamples = 0;
    this.shouldSend = false;
    this.fpsSum = 0;
    this.fpsSamples = 0;
    this.reset();
    Game.currentGame.network.addEnterWorldHandler(() => {
      this.reset();
      this.shouldSend = true;
    });
    Game.currentGame.network.addCloseHandler(() => {
      this.reset();
      this.shouldSend = false;
    });
    Game.currentGame.network.addErrorHandler(() => {
      this.reset();
      this.shouldSend = false;
    });
    Game.currentGame.renderer.addTickCallback((delta) => {
      if (!this.shouldSend) {
        return;
      }
      this.msElapsedSinceMetricsSent += delta;
      if (!this.updateMetrics()) {
        return;
      }
      this.sendMetrics();
    });
  }
  getFramesExtrapolated() {
    if ('framesExtrapolated' in this.metrics) {
      return this.metrics['framesExtrapolated'];
    }
    return 0;
  }
  reset() {
    this.pingSum = 0;
    this.pingSamples = 0;
    this.fpsSum = 0;
    this.fpsSamples = 0;
    this.metrics = {
      name: 'Metrics',
      minFps: null,
      maxFps: null,
      currentFps: null,
      averageFps: null,
      framesRendered: 0,
      framesInterpolated: 0,
      framesExtrapolated: 0,
      allocatedNetworkEntities: null,
      currentClientLag: null,
      minClientLag: null,
      maxClientLag: null,
      currentPing: null,
      minPing: null,
      maxPing: null,
      averagePing: null,
      longFrames: 0,
      stutters: 0,
      isMobile: 0,
      group: 0,
      timeResets: 0,
      maxExtrapolationTime: 0,
      totalExtrapolationTime: 0,
      extrapolationIncidents: 0,
      differenceInClientTime: 0
    };
  }
  updateMetrics() {
    if (!Game.currentGame.world.getReplicator().isFpsReady()) {
      return false;
    }
    if (!Game.currentGame.world.getReplicator().getTickIndex()) {
      return false;
    }
    var fps = Game.currentGame.world.getReplicator().getFps();
    var tickEntities = Game.currentGame.world.getReplicator().getTickEntities();
    var pooledCount = Game.currentGame.world.getPooledNetworkEntityCount();
    var st = Game.currentGame.world.getReplicator().getServerTime();
    var ct = Game.currentGame.world.getReplicator().getClientTime();
    var ping = Game.currentGame.network.getPing();
    var clientLag = st - ct;
    if (fps < this.metrics.minFps || this.metrics.minFps === null) {
      this.metrics.minFps = fps;
    }
    if (fps > this.metrics.maxFps || this.metrics.maxFps === null) {
      this.metrics.maxFps = fps;
    }
    this.metrics.currentFps = fps;
    this.fpsSamples++;
    this.fpsSum += fps;
    this.metrics.averageFps = this.fpsSum / this.fpsSamples;
    if (Game.currentGame.world.getReplicator().getInterpolating()) {
      this.metrics.framesInterpolated++;
    }
    else {
      this.metrics.framesExtrapolated++;
    }
    this.metrics.framesRendered++;
    this.metrics.allocatedNetworkEntities = tickEntities + pooledCount;
    this.metrics.currentClientLag = clientLag;
    if (clientLag < this.metrics.minClientLag || this.metrics.minClientLag === null) {
      this.metrics.minClientLag = clientLag;
    }
    if (clientLag > this.metrics.maxClientLag || this.metrics.maxClientLag === null) {
      this.metrics.maxClientLag = clientLag;
    }
    this.metrics.currentPing = ping;
    if (ping < this.metrics.minPing || this.metrics.minPing === null) {
      this.metrics.minPing = ping;
    }
    if (ping > this.metrics.maxPing || this.metrics.maxPing === null) {
      this.metrics.maxPing = ping;
    }
    this.pingSamples++;
    this.pingSum += ping;
    this.metrics.averagePing = this.pingSum / this.pingSamples;
    this.metrics.stutters = Game.currentGame.world.getReplicator().getFrameStutters();
    this.metrics.timeResets = Game.currentGame.world.getReplicator().getClientTimeResets();
    this.metrics.longFrames = Game.currentGame.renderer.getLongFrames();
    this.metrics.isMobile = Util.isMobile() ? 1 : 0;
    this.metrics.group = Game.currentGame.getGroup();
    this.metrics.maxExtrapolationTime = Game.currentGame.world.getReplicator().getMaxExtrapolationTime();
    this.metrics.totalExtrapolationTime = Game.currentGame.world.getReplicator().getTotalExtrapolationTime();
    this.metrics.extrapolationIncidents = Game.currentGame.world.getReplicator().getExtrapolationIncidents();
    this.metrics.differenceInClientTime = Game.currentGame.world.getReplicator().getDifferenceInClientTime();
    return true;
  }
  sendMetrics() {
    if (this.msElapsedSinceMetricsSent < 5000) {
      return;
    }
    try {
      Game.currentGame.network.sendRpc(this.metrics);
    }
    catch (e) {
      debug('Error while updating metrics ', e);
    }
    this.msElapsedSinceMetricsSent = 0;
  }
}

export default Metrics;
