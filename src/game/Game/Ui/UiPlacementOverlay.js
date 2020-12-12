import Game from "Game/Game/Game";
import UiComponent from "Game/Ui/UiComponent";
import TextEntity from "Engine/Entity/TextEntity";
import PlacementIndicatorModel from "Game/Models/PlacementIndicatorModel";
import template from "template/ui-placement-overlay.html";
import Debug from "debug";

const debug = Debug('Game:Ui/UiPlacementOverlay');

const BuildingDirection = {
  "UP": 0,
  "RIGHT": 1,
  "DOWN": 2,
  "LEFT": 3
}

Object.keys(BuildingDirection).forEach(pos => {
  BuildingDirection[BuildingDirection[pos]] = pos;
});

class UiPlacementOverlay extends UiComponent {
  constructor(ui) {
    super(ui, template);
    this.placeholderTints = [];
    this.borderTints = [];
    this.direction = BuildingDirection.UP;
    this.disableDirection = true;
    this.maxPlayerDistance = 12;
    this.maxStashDistance = 18;
    this.minWallDistance = 4;
    this.placeholderText = new TextEntity('Press R to rotate...', 'Hammersmith One', 16);
    this.placeholderText.setAnchor(0.5, 0.5);
    this.placeholderText.setColor(220, 220, 220);
    this.placeholderText.setStroke(51, 51, 51, 3);
    this.placeholderText.setFontWeight('bold');
    this.placeholderText.setLetterSpacing(1);
    this.placeholderText.setAlpha(0);
    this.placeholderText.setPosition(-1000, -1000);
    Game.currentGame.renderer.ui.addAttachment(this.placeholderText);
    Game.currentGame.renderer.on('cameraUpdate', this.onCameraUpdate.bind(this));
  }
  isActive() {
    return !!this.buildingId;
  }
  getBuildingId() {
    return this.buildingId;
  }
  update() {
    if (!this.buildingId) {
      return;
    }
    var buildingSchema = this.ui.getBuildingSchema();
    var schemaData = buildingSchema[this.buildingId];
    var mousePosition = this.ui.getMousePosition();
    var world = Game.currentGame.world;
    var worldPos = Game.currentGame.renderer.screenToWorld(mousePosition.x, mousePosition.y);
    var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, { width: schemaData.gridWidth, height: schemaData.gridHeight });
    var cellSize = world.entityGrid.getCellSize();
    var cellAverages = { x: 0, y: 0 };
    for (var i in cellIndexes) {
      if (!cellIndexes[i]) {
        this.placeholderTints[i].setVisible(false);
        continue;
      }
      var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
      var gridPos = {
        x: cellPos.x * cellSize + cellSize / 2,
        y: cellPos.y * cellSize + cellSize / 2
      };
      var uiPos = Game.currentGame.renderer.worldToUi(gridPos.x, gridPos.y);
      var isOccupied = this.checkIsOccupied(cellIndexes[i], cellPos);
      this.placeholderTints[i].setPosition(uiPos.x, uiPos.y);
      this.placeholderTints[i].setIsOccupied(isOccupied);
      this.placeholderTints[i].setVisible(true);
      cellAverages.x += cellPos.x;
      cellAverages.y += cellPos.y;
    }
    cellAverages.x = cellAverages.x / cellIndexes.length;
    cellAverages.y = cellAverages.y / cellIndexes.length;
    var gridPos = {
      x: cellAverages.x * cellSize + cellSize / 2,
      y: cellAverages.y * cellSize + cellSize / 2
    };
    var uiPos = Game.currentGame.renderer.worldToUi(gridPos.x, gridPos.y);
    this.placeholderEntity.setPosition(uiPos.x, uiPos.y);
    this.placeholderText.setPosition(uiPos.x, uiPos.y - 110);
  }
  startPlacing(buildingId) {
    if (this.buildingId) {
      this.cancelPlacing();
    }
    debug('Starting to place building: %s', buildingId);
    this.buildingId = buildingId;
    this.goldStash = null;
    var buildingSchema = this.ui.getBuildingSchema();
    var buildings = this.ui.getBuildings();
    var schemaData = buildingSchema[buildingId];
    if (['MeleeTower', 'Harvester'].indexOf(this.buildingId) > -1) {
      this.disableDirection = false;
      this.placeholderText.setAlpha(0.75);
      this.placeholderText.setPosition(-1000, -1000);
    }
    else {
      this.disableDirection = true;
      this.direction = BuildingDirection.UP;
      this.placeholderText.setAlpha(0);
      this.placeholderText.setPosition(-1000, -1000);
    }
    for (var uid in buildings) {
      if (buildings[uid].type == 'GoldStash') {
        this.goldStash = buildings[uid];
        break;
      }
    }
    var world = Game.currentGame.world;
    var cellSize = world.entityGrid.getCellSize();
    var totalCellsUsed = schemaData.gridWidth * schemaData.gridHeight;
    this.placeholderEntity = Game.currentGame.assetManager.loadModel(schemaData.modelName, {});
    this.placeholderEntity.setAlpha(0.5);
    this.placeholderEntity.setRotation(this.direction * 90);
    Game.currentGame.renderer.ui.addAttachment(this.placeholderEntity);
    for (var i = 0; i < totalCellsUsed; i++) {
      this.placeholderTints[i] = new PlacementIndicatorModel({
        width: cellSize,
        height: cellSize
      });
      Game.currentGame.renderer.ui.addAttachment(this.placeholderTints[i]);
    }
    for (var i = 0; i < 4; i++) {
      var halfWallDistance = this.minWallDistance / 2;
      if (i == 0 || i == 1) {
        this.borderTints[i] = new PlacementIndicatorModel({
          width: cellSize * this.minWallDistance,
          height: cellSize * world.entityGrid.getRows()
        });
      }
      else if (i == 2 || i == 3) {
        this.borderTints[i] = new PlacementIndicatorModel({
          width: cellSize * (world.entityGrid.getColumns() - this.minWallDistance * 2),
          height: cellSize * this.minWallDistance
        });
      }
      // TODO: hide if position is out of map
      Game.currentGame.renderer.ground.addAttachment(this.borderTints[i]);
      if (i == 0) {
        this.borderTints[i].setPosition(cellSize * halfWallDistance, cellSize * (world.entityGrid.getRows() / 2));
      }
      else if (i == 1) {
        this.borderTints[i].setPosition(cellSize * (world.entityGrid.getColumns() - halfWallDistance), cellSize * (world.entityGrid.getRows() / 2));
      }
      else if (i == 2) {
        this.borderTints[i].setPosition(cellSize * (world.entityGrid.getColumns() / 2), cellSize * halfWallDistance);
      }
      else if (i == 3) {
        this.borderTints[i].setPosition(cellSize * (world.entityGrid.getColumns() / 2), cellSize * (world.entityGrid.getRows() - halfWallDistance));
      }
      this.borderTints[i].setIsOccupied(true);
    }
    this.update();
  }
  placeBuilding() {
    if (!this.buildingId) {
      return;
    }
    debug('Attempting to place building: %s', this.buildingId);
    var localPlayer = Game.currentGame.world.getLocalPlayer();
    if (!localPlayer) {
      return false;
    }
    var localEntity = localPlayer.getEntity();
    if (!localEntity) {
      return false;
    }
    var buildingSchema = this.ui.getBuildingSchema();
    var schemaData = buildingSchema[this.buildingId];
    var mousePosition = this.ui.getMousePosition();
    var world = Game.currentGame.world;
    var worldPos = Game.currentGame.renderer.screenToWorld(mousePosition.x, mousePosition.y);
    var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, { width: schemaData.gridWidth, height: schemaData.gridHeight });
    var cellSize = world.entityGrid.getCellSize();
    var cellAverages = { x: 0, y: 0 };
    for (var i in cellIndexes) {
      if (!cellIndexes[i]) {
        return false;
      }
      var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
      var isOccupied = this.checkIsOccupied(cellIndexes[i], cellPos);
      cellAverages.x += cellPos.x;
      cellAverages.y += cellPos.y;
    }
    cellAverages.x = cellAverages.x / cellIndexes.length;
    cellAverages.y = cellAverages.y / cellIndexes.length;
    var gridPos = {
      x: cellAverages.x * cellSize + cellSize / 2,
      y: cellAverages.y * cellSize + cellSize / 2
    };
    var makeRpc = {
      name: 'MakeBuilding',
      x: gridPos.x,
      y: gridPos.y,
      type: this.buildingId,
      yaw: this.direction * 90
    };
    Game.currentGame.network.sendRpc(makeRpc);
    if (schemaData.built + 1 >= schemaData.limit) {
      this.cancelPlacing();
    }
    return true;
  }
  cancelPlacing() {
    if (!this.buildingId) {
      return;
    }
    debug('Cancelling placing building: %s', this.buildingId);
    Game.currentGame.renderer.ui.removeAttachment(this.placeholderEntity);
    for (var i in this.placeholderTints) {
      Game.currentGame.renderer.ui.removeAttachment(this.placeholderTints[i]);
    }
    for (var i in this.borderTints) {
      Game.currentGame.renderer.ground.removeAttachment(this.borderTints[i]);
    }
    this.placeholderText.setAlpha(0);
    this.placeholderText.setPosition(-1000, -1000);
    this.placeholderEntity = null;
    this.placeholderTints = [];
    this.borderTints = [];
    this.buildingId = null;
  }
  cycleDirection() {
    if (this.disableDirection) {
      return;
    }
    this.direction = (this.direction + 1) % 4;
    this.placeholderEntity.setRotation(this.direction * 90);
  }
  checkIsOccupied(cellIndex, cellPos) {
    var world = Game.currentGame.world;
    var cellSize = world.entityGrid.getCellSize();
    var entities = world.entityGrid.getEntitiesInCell(cellIndex);
    var gridPos = {
      x: cellPos.x * cellSize + cellSize / 2,
      y: cellPos.y * cellSize + cellSize / 2
    };
    if (!entities) {
      return true;
    }
    var buildings = 0;
    for (var uid in entities) {
      var networkEntity = world.getEntityByUid(parseInt(uid));
      if (!networkEntity) {
        continue;
      }
      var entityTick = networkEntity.getTargetTick();
      if (!entityTick) {
        continue;
      }
      buildings += entityTick.entityClass !== 'Projectile' ? 1 : 0;
    }
    if (buildings > 0) {
      return true;
    }
    var wallDistanceX = Math.min(cellPos.x, world.entityGrid.getColumns() - 1 - cellPos.x);
    var wallDistanceY = Math.min(cellPos.y, world.entityGrid.getRows() - 1 - cellPos.y);
    if (wallDistanceX < this.minWallDistance || wallDistanceY < this.minWallDistance) {
      return true;
    }
    var localPlayer = world.getLocalPlayer();
    if (localPlayer) {
      var localEntity = localPlayer.getEntity();
      if (localEntity) {
        var cellDistanceX = Math.abs(localEntity.getPositionX() - gridPos.x) / cellSize;
        var cellDistanceY = Math.abs(localEntity.getPositionY() - gridPos.y) / cellSize;
        if (cellDistanceX > this.maxPlayerDistance || cellDistanceY > this.maxPlayerDistance) {
          return true;
        }
      }
    }
    if (this.goldStash && this.buildingId !== 'Harvester') {
      var cellDistanceX = Math.abs(this.goldStash.x - gridPos.x) / cellSize;
      var cellDistanceY = Math.abs(this.goldStash.y - gridPos.y) / cellSize;
      if (cellDistanceX > this.maxStashDistance || cellDistanceY > this.maxStashDistance) {
        return true;
      }
    }
    return false;
  }
  onCameraUpdate() {
    this.update();
  }
}

export default UiPlacementOverlay;
