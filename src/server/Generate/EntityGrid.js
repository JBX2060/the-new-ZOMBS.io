import entities from "Game/entities";
import PF from "pathfinding";
import { models as towerModels } from "Entities/Tower";
import { models as wallModels } from "Entities/Wall";
import { models as doorModels } from "Entities/Door";
import { models as goldStashModels } from "Entities/GoldStash";
import { models as goldMineModels } from "Entities/GoldMine";
import { models as treeModels } from "Entities/Tree";
import { models as stoneModels } from "Entities/Stone";
import { models as neutralCampModels } from "Entities/NeutralCamp";

const models = [
  ...towerModels,
  ...wallModels,
  ...doorModels,
  ...goldStashModels,
  ...goldMineModels,
  ...treeModels,
  ...stoneModels,
  ...neutralCampModels
];

class EntityGrid {
  constructor(width, height, cellSize) {
    this.cellEntities = [];
    this.entityMap = {};
    this.oneGridSize = { width: 1, height: 1 };
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.rows = Math.floor(this.height / this.cellSize);
    this.columns = Math.floor(this.width / this.cellSize);
    this.totalCells = this.rows * this.columns;
    this.grid = new PF.Grid(this.rows, this.columns);
    this.finder = new PF.AStarFinder({
      allowDiagonals: true,
      dontCrossCorners: true
    });

    for (var i = 0; i < this.totalCells; i++) {
      this.cellEntities[i] = {};
    }
  }
  findPath(from, to) {
    const gridBackup = this.grid.clone();
    try {
      const path = this.finder.findPath(
        Math.floor(from.position.x / this.cellSize),
        Math.floor(from.position.y / this.cellSize),
        Math.floor(to.position.x / this.cellSize),
        Math.floor(to.position.y / this.cellSize),
        this.grid
      );

      this.grid = gridBackup;
      return path;
    } catch {
      this.grid = gridBackup;
      return [];
    }
  }
  getEntitiesInCell(index) {
    if (index in this.cellEntities) {
      return this.cellEntities[index];
    }
    return false;
  }
  updateEntity(entity) {
    var gridSize = this.oneGridSize;
    var tick = entity.getTargetTick();
    if (tick && "model" in tick) {
      var entityData = entities[tick.model];
      if (entityData && "gridSize" in entityData) {
        gridSize = entityData.gridSize;
      }
    }
    var cellIndexes = this.getCellIndexes(
      entity.getPositionX(),
      entity.getPositionY(),
      gridSize
    );
    if (!(entity.uid in this.entityMap)) {
      if (models.indexOf(entity.model) >= 0) {
        for (const { x, y } of this.getEntityCells(
          entity.getPositionY(),
          entity.getPositionX(),
          gridSize
        )) {
          this.grid.setWalkableAt(x, y, false);
        }
      }
      this.addEntityToCells(entity.uid, cellIndexes);
      return;
    }
    var isDirty =
      this.entityMap[entity.uid].length !== cellIndexes.length ||
      !this.entityMap[entity.uid].every(function(element, i) {
        return element === cellIndexes[i];
      });
    if (isDirty) {
      if (models.indexOf(entity.model) >= 0) {
        for (const { x, y } of this.getEntityCells(
          entity.getPositionY(),
          entity.getPositionX(),
          gridSize
        )) {
          this.grid.setWalkableAt(x, y, true);
        }
      }
      this.removeEntityFromCells(entity.uid, this.entityMap[entity.uid]);
      this.addEntityToCells(entity.uid, cellIndexes);
    }
  }
  removeEntity(uid) {
    this.removeEntityFromCells(uid, this.entityMap[uid]);
  }
  getEntityCells(x, y, gridSize) {
    var indexes = [];
    for (
      var xOffset = -gridSize.width / 2 + 0.5;
      xOffset < gridSize.width / 2;
      xOffset++
    ) {
      for (
        var yOffset = -gridSize.height / 2 + 0.5;
        yOffset < gridSize.height / 2;
        yOffset++
      ) {
        indexes.push({
          y: Math.floor(y / this.cellSize + yOffset),
          x: Math.floor(x / this.cellSize + xOffset)
        });
      }
    }
    return indexes;
  }
  getCellIndexes(x, y, gridSize) {
    var indexes = [];
    for (
      var xOffset = -gridSize.width / 2 + 0.5;
      xOffset < gridSize.width / 2;
      xOffset++
    ) {
      for (
        var yOffset = -gridSize.height / 2 + 0.5;
        yOffset < gridSize.height / 2;
        yOffset++
      ) {
        var index =
          this.columns * Math.floor(y / this.cellSize + yOffset) +
          Math.floor(x / this.cellSize + xOffset);
        if (index > 0 && index < this.totalCells) {
          indexes.push(index);
        } else {
          indexes.push(false);
        }
      }
    }
    return indexes;
  }
  getCellCoords(index) {
    return {
      x: index % this.columns,
      y: Math.floor(index / this.columns)
    };
  }
  getCellSize() {
    return this.cellSize;
  }
  getRows() {
    return this.rows;
  }
  getColumns() {
    return this.columns;
  }
  removeEntityFromCells(uid, indexes) {
    if (indexes) {
      for (var i in indexes) {
        if (!indexes[i]) {
          continue;
        }
        delete this.cellEntities[indexes[i]][uid];
      }
    }
    delete this.entityMap[uid];
  }
  addEntityToCells(uid, indexes) {
    for (var i in indexes) {
      if (!indexes[i]) {
        continue;
      }
      this.cellEntities[indexes[i]][uid] = true;
    }
    this.entityMap[uid] = indexes;
  }
}

export default EntityGrid;
