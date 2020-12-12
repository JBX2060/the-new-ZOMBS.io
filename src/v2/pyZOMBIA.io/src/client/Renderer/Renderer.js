import Debugger from "debug";
import { Application } from "@pixi/app";
import { Viewport } from "pixi-viewport";
import RendererLayer from "Renderer/RendererLayer";
import NetworkEntity from "Entity/NetworkEntity";
import Entity from "Entity/Entity";
import Progress from "Ui/Progress";

class Renderer extends Application {
  constructor() {
    super({
      view: document.querySelector("canvas"),
      resolution: window.devicePixelRatio,
      backgroundColor: 0x0,
      autoResize: true,
      antialias: true
    });

    this.debug = new Debugger("Game/Renderer");

    this.ticker.minFPS = 60;
    this.ticker.add(this.update.bind(this));

    this.viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 1500,
      worldHeight: 1500,

      interaction: this.renderer.plugins.interaction
    });

    this.viewport.scale.x *= 0.6;
    this.viewport.scale.y *= 0.6;

    this.stage.addChild(this.viewport);

    this.scene = new Entity();
    this.ground = new RendererLayer();
    this.scene.addAttachment(this.ground);
    this.entities = new RendererLayer();
    this.scene.addAttachment(this.entities);
    this.ui = new RendererLayer();
    this.scene.addAttachment(this.ui);
    this.viewport.addChild(this.scene.getNode());

    this.progress = new Progress();
    this.ui.addAttachment(this.progress);

    window.addEventListener("resize", this.onWindowResize.bind(this));
    window.addEventListener("contextmenu", this.onContextMenu.bind(this));

    this.onWindowResize();
  }

  add(object) {
    this.entities.addAttachment(object);
  }

  remove(object) {
    this.entities.removeAttachment(object);
  }

  update() {
    this.renderer.render(this.scene.node);
  }

  addTickCallback(callback) {
    this.ticker.add(callback);
  }

  onContextMenu(e) {
    e.preventDefault();
  }

  onWindowResize(e) {
    const canvasWidth = window.innerWidth * window.devicePixelRatio;
    const canvasHeight = window.innerHeight * window.devicePixelRatio;
    const ratio = Math.max(canvasWidth / 1920, canvasHeight / 1080);

    //this.scale = ratio;
    //this.entities.setScale(ratio);
    this.renderer.resize(canvasWidth, canvasHeight);
    this.viewport.resize();
  }
}

export default Renderer;
