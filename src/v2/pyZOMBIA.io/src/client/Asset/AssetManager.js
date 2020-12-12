import Debugger from "debug";
import { Loader } from "@pixi/loaders";
import EventEmitter from "events";
import * as models from "../Models";

class AssetManager extends EventEmitter {
  constructor() {
    super();

    this.debug = new Debugger("Game/AssetManager");
    this.loader = new Loader();
    this.shouldPreload = true;

    this.loader.on("progress", (loader, resource) => {
      this.emit("progress", loader.progress);
    });
  }

  load(files) {
    if (!this.shouldPreload) return;

    this.loader.add(files).load((loader, resources) => {
      this.textures = resources;
      this.emit("loaded", resources);
    });
  }

  loadModel(model) {
    return new models[model];
  }
}

export default AssetManager;
