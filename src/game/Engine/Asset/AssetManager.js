import * as PIXI from "pixi.js";
import Debug from "debug";

const debug = Debug("Engine:Asset/AssetManager");

class AssetManager {
  constructor() {
    this.shouldPreload = true;
  }

  load(files, callback) {
    if (callback === void 0) { callback = false; }
    if (!this.shouldPreload) {
      return;
    }
    debug('Preloading %d assets...', files.length);
    PIXI.Loader.shared.add(files).load(function () {
      if (callback) {
        debug('Executing callback for asset preloading...');
        callback();
      }
    });
  }

  addProgressCallback(callback) {
    PIXI.Loader.shared.on('progress', function (loader, loadedResource) {
      callback(loader.progress);
    });
  }

  getShouldPreload() {
    return this.shouldPreload;
  }

  setShouldPreload(shouldPreload) {
    this.shouldPreload = shouldPreload;
  }

  loadModel(modelName, args = null) {
    const ModelClass = require(
      '../../Game/Models/' + modelName
    );

    return new ModelClass.default(args);
  }
}

export default AssetManager;
