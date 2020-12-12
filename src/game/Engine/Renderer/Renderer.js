import * as PIXI from "pixi.js";
import Game from "Engine/Game/Game";
import RendererLayer from "Engine/Renderer/RendererLayer";
import Entity from "Engine/Entity/Entity";
import NetworkEntity from "Engine/Entity/NetworkEntity";
import GroundEntity from "Engine/Entity/GroundEntity";
import TextEntity from "Engine/Entity/TextEntity";
import EventEmitter from "events";
import Debug from "debug";
import "pixi.js-legacy";

const debug = Debug("Engine:Renderer/Renderer");

class Renderer extends EventEmitter {
  constructor(forceCanvas = false) {
    super();

    this.scale = 1;
    this.forceCanvas = false;
    this.tickCallbacks = [];
    this.lastMsElapsed = 0;
    this.firstPerformance = null;
    this.followingObject = null;
    this.viewport = { x: -500, y: -400, width: 1000, height: 800 };
    this.viewportPadding = 100;
    this.longFrames = 0;
    this.forceCanvas = forceCanvas;
    this.renderer = PIXI.autoDetectRenderer(
      {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x222222,
        antialias: true
      },
      this.forceCanvas
    );
    this.renderer.roundPixels = true;
    this.renderer.plugins.interaction.destroy();
    this.renderer.view.oncontextmenu = function(e) {
      e.preventDefault();
    };
    document.body.appendChild(this.renderer.view);
    window.addEventListener("resize", this.onWindowResize.bind(this));
    this.ticker = new PIXI.Ticker();
    this.ticker.minFPS = 60;
    this.ticker.add(this.update.bind(this));
    this.scene = new Entity();
    this.entities = new RendererLayer();
    this.ui = new RendererLayer();
    this.ground = new RendererLayer();
    this.entities.addAttachment(this.ground);
    this.scenery = new RendererLayer();
    this.entities.addAttachment(this.scenery);
    this.npcs = new RendererLayer();
    this.entities.addAttachment(this.npcs);
    this.projectiles = new RendererLayer();
    this.entities.addAttachment(this.projectiles);
    this.players = new RendererLayer();
    this.entities.addAttachment(this.players);
    this.scene.addAttachment(this.entities);
    this.scene.addAttachment(this.ui);
    this.scene.setVisible(false);
    this.onWindowResize();
  }
  add(object, entityClass) {
    if (entityClass === void 0) {
      entityClass = undefined;
    }
    if (object instanceof NetworkEntity) {
      switch (entityClass) {
        case "Prop":
          this.scenery.addAttachment(object);
          break;
        case "Projectile":
          this.projectiles.addAttachment(object);
          break;
        case "Player":
          this.players.addAttachment(object);
          break;
        case "Npc":
          this.npcs.addAttachment(object);
          break;
        default:
          this.npcs.addAttachment(object);
      }
    } else if (object instanceof GroundEntity) {
      this.ground.addAttachment(object);
    } else if (object instanceof TextEntity) {
      this.ui.addAttachment(object);
    } else {
      throw new Error("Unhandled object: " + JSON.stringify(object));
    }
  }
  getLongFrames() {
    return this.longFrames;
  }
  remove(object) {
    if (object instanceof NetworkEntity) {
      switch (object.entityClass) {
        case "Prop":
          this.scenery.removeAttachment(object);
          break;
        case "Projectile":
          this.projectiles.removeAttachment(object);
          break;
        case "Player":
          this.players.removeAttachment(object);
          break;
        case "Npc":
          this.npcs.removeAttachment(object);
          break;
        default:
          this.npcs.removeAttachment(object);
      }
    } else if (object instanceof GroundEntity) {
      this.ground.removeAttachment(object);
    } else if (object instanceof TextEntity) {
      this.ui.removeAttachment(object);
    }
  }
  follow(object) {
    this.scene.setVisible(true);
    this.followingObject = object;
  }
  stopFollowing() {
    this.followingObject = null;
  }
  start(firstTime) {
    this.ticker.start();
  }
  stop() {
    this.ticker.stop();
  }
  screenToWorld(x, y) {
    var offsetX = -this.entities.getPositionX();
    var offsetY = -this.entities.getPositionY();
    offsetX = offsetX * (1 / this.scale);
    offsetY = offsetY * (1 / this.scale);
    x = x * (1 / this.scale) * window.devicePixelRatio;
    y = y * (1 / this.scale) * window.devicePixelRatio;
    return {
      x: offsetX + x,
      y: offsetY + y
    };
  }
  worldToScreen(x, y) {
    var offsetX = -this.entities.getPositionX();
    var offsetY = -this.entities.getPositionY();
    offsetX = offsetX * (1 / this.scale);
    offsetY = offsetY * (1 / this.scale);
    return {
      x: (x - offsetX) * this.scale * (1 / window.devicePixelRatio),
      y: (y - offsetY) * this.scale * (1 / window.devicePixelRatio)
    };
  }
  worldToUi(x, y) {
    var offsetX = -this.entities.getPositionX();
    var offsetY = -this.entities.getPositionY();
    offsetX = offsetX * (1 / this.scale);
    offsetY = offsetY * (1 / this.scale);
    return {
      x: x - offsetX,
      y: y - offsetY
    };
  }
  lookAtPosition(x, y) {
    var halfX = (window.innerWidth * window.devicePixelRatio) / 2;
    var halfY = (window.innerHeight * window.devicePixelRatio) / 2;
    x = x * this.scale;
    y = y * this.scale;
    var oldPositionX = this.entities.getPositionX();
    var oldPositionY = this.entities.getPositionY();
    var newPosition = { x: -x + halfX, y: -y + halfY };
    this.entities.setPosition(newPosition.x, newPosition.y);
    this.viewport.x =
      x / this.scale - halfX / this.scale - this.viewportPadding;
    this.viewport.y =
      y / this.scale - halfY / this.scale - this.viewportPadding;
    if (oldPositionX !== newPosition.x || oldPositionY !== newPosition.y) {
      this.emit("cameraUpdate", newPosition);
    }
  }
  addTickCallback(callback) {
    this.tickCallbacks.push(callback);
  }
  getWidth() {
    return this.renderer.width / window.devicePixelRatio;
  }
  getHeight() {
    return this.renderer.height / window.devicePixelRatio;
  }
  getScale() {
    return this.scale;
  }
  getForceCanvas() {
    return this.forceCanvas;
  }
  getCurrentViewport() {
    return this.viewport;
  }
  getInternalRenderer() {
    return this.renderer;
  }
  update(delta) {
    if (this.firstPerformance === null) {
      this.firstPerformance = performance.now();
      return;
    }
    var now = performance.now();
    var totalMs = now - this.firstPerformance;
    var currentMs = totalMs - this.lastMsElapsed;
    this.lastMsElapsed = totalMs;
    delta = currentMs;
    Game.currentGame.debug.begin();
    try {
      for (var i in this.tickCallbacks) {
        this.tickCallbacks[i](delta);
      }
    } catch (e) {
      debug("Failed to execute tick callbacks: ", e);
    }
    if (this.followingObject) {
      this.lookAtPosition(
        this.followingObject.getPositionX(),
        this.followingObject.getPositionY()
      );
    }
    try {
      this.scene.update(delta, null);
    } catch (e) {
      debug("Failed to update scene entities: ", e);
    }
    this.renderer.render(this.scene.getNode());
    var timerTotal = Math.round((performance.now() - now) * 100) / 100;
    if (timerTotal >= 10) {
      this.longFrames++;
      debug("Renderer update was slow and took %fms...", timerTotal);
    }
    Game.currentGame.debug.end();
  }
  countTotalNodes(node) {
    var total = 1;
    for (var i in node.children) {
      total += this.countTotalNodes(node.children[i]);
    }
    return total;
  }
  countEmptyNodes(node) {
    var total = node.constructor.name == "Container" ? 1 : 0;
    for (var i in node.children) {
      total += this.countEmptyNodes(node.children[i]);
    }
    return total;
  }
  onWindowResize() {
    var canvasWidth = window.innerWidth * window.devicePixelRatio;
    var canvasHeight = window.innerHeight * window.devicePixelRatio;
    var ratio = Math.max(canvasWidth / 1920, canvasHeight / 1080);
    this.scale = ratio;
    this.entities.setScale(ratio);
    this.ui.setScale(ratio);
    this.renderer.resize(canvasWidth, canvasHeight);
    this.viewport.width =
      this.renderer.width / this.scale + 2 * this.viewportPadding;
    this.viewport.height =
      this.renderer.height / this.scale + 2 * this.viewportPadding;
  }
}

export default Renderer;
