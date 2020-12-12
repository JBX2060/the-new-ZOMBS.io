import entities from "Game/entities";

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
    for (var i = 0; i < this.totalCells; i++) {
      this.cellEntities[i] = {};
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
    if (tick && 'model' in tick) {
      var entityData = entities[tick.model];
      if (entityData && 'gridSize' in entityData) {
        gridSize = entityData.gridSize;
      }
    }
    var cellIndexes = this.getCellIndexes(entity.getPositionX(), entity.getPositionY(), gridSize);
    if (!(entity.uid in this.entityMap)) {
      this.addEntityToCells(entity.uid, cellIndexes);
      return;
    }
    var isDirty = this.entityMap[entity.uid].length !== cellIndexes.length || !this.entityMap[entity.uid].every(function (element, i) {
      return element === cellIndexes[i];
    });
    if (isDirty) {
      this.removeEntityFromCells(entity.uid, this.entityMap[entity.uid]);
      this.addEntityToCells(entity.uid, cellIndexes);
    }
  }
  removeEntity(uid) {
    this.removeEntityFromCells(uid, this.entityMap[uid]);
  }
  getCellIndexes(x, y, gridSize) {
    var indexes = [];
    for (var xOffset = -gridSize.width / 2 + 0.5; xOffset < gridSize.width / 2; xOffset++) {
      for (var yOffset = -gridSize.height / 2 + 0.5; yOffset < gridSize.height / 2; yOffset++) {
        var index = this.columns * Math.floor(y / this.cellSize + yOffset) + Math.floor(x / this.cellSize + xOffset);
        if (index > 0 && index < this.totalCells) {
          indexes.push(index);
        }
        else {
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