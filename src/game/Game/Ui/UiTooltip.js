"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UiTooltip = (function () {
  function UiTooltip(targetElem, callback, anchor) {
    if (anchor === void 0) { anchor = 'top'; }
    this.anchor = 'top';
    this.targetElem = targetElem;
    this.callback = callback;
    this.anchor = anchor;
    this.bindInputEvents();
  }
  UiTooltip.prototype.getTargetElem = function () {
    return this.targetElem;
  };
  UiTooltip.prototype.setAnchor = function (anchor) {
    this.anchor = anchor;
  };
  UiTooltip.prototype.hide = function () {
    if (!this.tooltipElem) {
      return;
    }
    this.tooltipElem.remove();
    delete this.tooltipElem;
  };
  UiTooltip.prototype.bindInputEvents = function () {
    var _this = this;
    this.targetElem.addEventListener('mouseenter', function (event) {
      var tooltipHtml = "\n            <div id=\"hud-tooltip\" class=\"hud-tooltip\">\n                " + _this.callback(_this.targetElem) + "\n            </div>\n            ";
      document.body.insertAdjacentHTML('beforeend', tooltipHtml);
      _this.tooltipElem = document.getElementById('hud-tooltip');
      var elementOffset = _this.targetElem.getBoundingClientRect();
      var tooltipOffset = { left: 0, top: 0 };
      if (_this.anchor == 'top') {
        tooltipOffset.left = elementOffset.left + elementOffset.width / 2 - _this.tooltipElem.offsetWidth / 2;
        tooltipOffset.top = elementOffset.top - _this.tooltipElem.offsetHeight - 20;
      }
      else if (_this.anchor == 'bottom') {
        tooltipOffset.left = elementOffset.left + elementOffset.width / 2 - _this.tooltipElem.offsetWidth / 2;
        tooltipOffset.top = elementOffset.top + elementOffset.height + 20;
      }
      else if (_this.anchor == 'left') {
        tooltipOffset.left = elementOffset.left - _this.tooltipElem.offsetWidth - 20;
        tooltipOffset.top = elementOffset.top + elementOffset.height / 2 - _this.tooltipElem.offsetHeight / 2;
      }
      else if (_this.anchor == 'right') {
        tooltipOffset.left = elementOffset.left + elementOffset.width + 20;
        tooltipOffset.top = elementOffset.top + elementOffset.height / 2 - _this.tooltipElem.offsetHeight / 2;
      }
      _this.tooltipElem.className = 'hud-tooltip hud-tooltip-' + _this.anchor;
      _this.tooltipElem.style.left = tooltipOffset.left + 'px';
      _this.tooltipElem.style.top = tooltipOffset.top + 'px';
    });
    this.targetElem.addEventListener('mouseleave', function (event) {
      _this.hide();
    });
  };
  return UiTooltip;
}());
exports.default = UiTooltip;

