import * as PIXI from "pixi.js";
import Entity from "Engine/Entity/Entity";

class TextEntity extends Entity {
  constructor(text, fontName, fontSize) {
    super();

    this.text = new PIXI.Text(text, {
      fontFamily: fontName,
      fontSize: fontSize,
      lineJoin: 'round',
      padding: 10
    });
    this.text.resolution = 2 * window.devicePixelRatio;
    this.setNode(this.text);
  }
  setColor(r, g, b) {
    this.text.style.fill = (r << 16) | (g << 8) | b;
  }
  setStroke(r, g, b, thickness) {
    this.text.style.stroke = (r << 16) | (g << 8) | b;
    this.text.style.strokeThickness = thickness;
  }
  setFontWeight(weight) {
    this.text.style.fontWeight = weight;
  }
  setLetterSpacing(spacing) {
    this.text.style.letterSpacing = spacing;
  }
  setAnchor(x, y) {
    this.text.anchor.set(x, y);
  }
  setString(text) {
    this.text.text = text;
  }
}


export default TextEntity;