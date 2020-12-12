import * as PIXI from "pixi.js";
import Game from "Engine/Game/Game";
import Entity from "Engine/Entity/Entity";

class DrawEntity extends Entity {
  constructor() {
    super();

    this.draw = new PIXI.Graphics();
    this.clear();
    this.setNode(this.draw);
    return this;
  }

  drawTriangle(point0, point1, point2, fill, lineFill, lineWidth) {
    if (fill === void 0) { fill = null; }
    if (lineFill === void 0) { lineFill = null; }
    if (lineWidth === void 0) { lineWidth = null; }
    if (lineWidth && lineWidth > 0) {
      this.draw.lineStyle(lineWidth, (lineFill.r << 16) | (lineFill.g << 8) | (lineFill.b), lineFill.a);
    }
    if (fill) {
      this.draw.beginFill((fill.r << 16) | (fill.g << 8) | (fill.b), fill.a);
    }
    this.draw.drawPolygon([point0.x, point0.y, point1.x, point1.y, point2.x, point2.y]);
    if (fill) {
      this.draw.endFill();
    }
  }

  drawArc(cx, cy, radius, startAngle, endAngle, antiClockwise, fill, lineFill, lineWidth) {
    if (fill === void 0) { fill = null; }
    if (lineFill === void 0) { lineFill = null; }
    if (lineWidth === void 0) { lineWidth = null; }
    if (lineWidth && lineWidth > 0) {
      this.draw.lineStyle(lineWidth, (lineFill.r << 16) | (lineFill.g << 8) | (lineFill.b), lineFill.a);
    }
    startAngle = startAngle * Math.PI / 180.0;
    endAngle = endAngle * Math.PI / 180.0;
    if (fill) {
      this.draw.beginFill((fill.r << 16) | (fill.g << 8) | (fill.b), fill.a);
    }
    this.draw.arc(cx, cy, radius, startAngle, endAngle, antiClockwise);
    if (fill) {
      this.draw.endFill();
    }
  }

  drawCircle(x, y, radius, fill, lineFill, lineWidth) {
    if (fill === void 0) { fill = null; }
    if (lineFill === void 0) { lineFill = null; }
    if (lineWidth === void 0) { lineWidth = null; }
    if (lineWidth && lineWidth > 0) {
      this.draw.lineStyle(lineWidth, (lineFill.r << 16) | (lineFill.g << 8) | (lineFill.b), lineFill.a);
    }
    if (fill) {
      this.draw.beginFill((fill.r << 16) | (fill.g << 8) | (fill.b), fill.a);
    }
    this.draw.drawCircle(x, y, radius);
    if (fill) {
      this.draw.endFill();
    }
  }

  drawRect(x1, y1, x2, y2, fill, lineFill, lineWidth) {
    if (fill === void 0) { fill = null; }
    if (lineFill === void 0) { lineFill = null; }
    if (lineWidth === void 0) { lineWidth = null; }
    if (lineWidth && lineWidth > 0) {
      this.draw.lineStyle(lineWidth, (lineFill.r << 16) | (lineFill.g << 8) | (lineFill.b), lineFill.a);
    }
    if (fill) {
      this.draw.beginFill((fill.r << 16) | (fill.g << 8) | (fill.b), fill.a);
    }
    this.draw.drawRect(x1, y1, x2 - x1, y2 - y1);
    if (fill) {
      this.draw.endFill();
    }
  }

  drawRoundedRect(x1, y1, x2, y2, radius, fill, lineFill, lineWidth) {
    if (fill === void 0) { fill = null; }
    if (lineFill === void 0) { lineFill = null; }
    if (lineWidth === void 0) { lineWidth = null; }
    if (lineWidth && lineWidth > 0) {
      this.draw.lineStyle(lineWidth, (lineFill.r << 16) | (lineFill.g << 8) | (lineFill.b), lineFill.a);
    }
    if (fill) {
      this.draw.beginFill((fill.r << 16) | (fill.g << 8) | (fill.b), fill.a);
    }
    this.draw.drawRoundedRect(x1, y1, x2 - x1, y2 - y1, radius);
    if (fill) {
      this.draw.endFill();
    }
  }

  drawEllipse(x, y, width, height, fill, lineFill, lineWidth) {
    if (fill === void 0) { fill = null; }
    if (lineFill === void 0) { lineFill = null; }
    if (lineWidth === void 0) { lineWidth = null; }
    if (lineWidth && lineWidth > 0) {
      this.draw.lineStyle(lineWidth, (lineFill.r << 16) | (lineFill.g << 8) | (lineFill.b), lineFill.a);
    }
    if (fill) {
      this.draw.beginFill((fill.r << 16) | (fill.g << 8) | (fill.b), fill.a);
    }
    this.draw.drawEllipse(x, y, width, height);
    if (fill) {
      this.draw.endFill();
    }
  }

  getTexture() {
    return Game.currentGame.renderer.getInternalRenderer().generateTexture(this.draw);
  }

  clear() {
    this.draw.clear();
  } 
}

export default DrawEntity;
