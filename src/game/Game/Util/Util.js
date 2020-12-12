import Game from "Game/Game/Game";
import UtilEngine from "Engine/Util/Util";

class Util extends UtilEngine {
  static hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  static canAfford(data, tier, multiplier) {
    if (tier === void 0) { tier = 1; }
    if (multiplier === void 0) { multiplier = 1; }
    var resourceCosts = [];
    var resources = { wood: 'wood', stone: 'stone', gold: 'gold', token: 'tokens' };
    var canAfford = true;
    var playerTick = Game.currentGame.ui.getPlayerTick();
    for (var resourceId in resources) {
      var resourceKey = resourceId + 'Costs';
      if (data[resourceKey] && data[resourceKey][tier - 1]) {
        var rawCost = data[resourceKey][tier - 1] * multiplier;
        canAfford = canAfford && playerTick && playerTick.wood >= rawCost;
      }
    }
    return canAfford;
  };
  static createResourceCostString(data, tier, multiplier) {
    if (tier === void 0) { tier = 1; }
    if (multiplier === void 0) { multiplier = 1; }
    var resourceCosts = [];
    var resources = { wood: 'wood', stone: 'stone', gold: 'gold', token: 'tokens' };
    var playerTick = Game.currentGame.ui.getPlayerTick();
    for (var resourceId in resources) {
      var resourceKey = resourceId + 'Costs';
      if (data[resourceKey] && data[resourceKey][tier - 1]) {
        var rawCost = data[resourceKey][tier - 1] * multiplier;
        var canAfford = playerTick && playerTick[resourceId] >= rawCost;
        if (canAfford) {
          resourceCosts.push("<span class=\"hud-resource-" + resources[resourceId] + "\">" + rawCost.toLocaleString() + " " + resources[resourceId] + "</span>");
        }
        else {
          resourceCosts.push("<span class=\"hud-resource-" + resources[resourceId] + " hud-resource-low\">" + rawCost.toLocaleString() + " " + resources[resourceId] + "</span>");
        }
      }
    }
    if (resourceCosts.length > 0) {
      return resourceCosts.join(', ');
    }
    return "<span class=\"hud-resource-free\">Free</span>";
  };
  static createResourceRefundString(data, tier) {
    if (tier === void 0) { tier = 1; }
    var resourcesRefunded = [];
    var resources = { wood: 'wood', stone: 'stone', gold: 'gold', token: 'tokens' };
    var playerTick = Game.currentGame.ui.getPlayerTick();
    for (var resourceId in resources) {
      var resourceKey = resourceId + 'Costs';
      if (data[resourceKey]) {
        var rawRefund = Math.floor(data[resourceKey].slice(0, tier).reduce(function (a, b) { return a + b; }, 0) / 2);
        if (rawRefund) {
          resourcesRefunded.push("<span class=\"hud-resource-" + resources[resourceId] + "\">" + rawRefund.toLocaleString() + " " + resources[resourceId] + "</span>");
        }
      }
    }
    if (resourcesRefunded.length > 0) {
      return resourcesRefunded.join(', ');
    }
    return "<span class=\"hud-resource-free\">None</span>";
  };
}

export default Util;
