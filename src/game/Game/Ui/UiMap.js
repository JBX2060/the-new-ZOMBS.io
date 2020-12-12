import template from "template/ui-map.html";
import Game from "Game/Game/Game";
import UiComponent from "Game/Ui/UiComponent";

class UiMap extends UiComponent {
  constructor(ui) {
    super(ui, template);
    this.playerElems = {};
    this.buildingElems = {};
    Game.currentGame.renderer.addTickCallback(this.update.bind(this));
    this.ui.on('buildingsUpdate', this.onBuildingsUpdate.bind(this));
    this.ui.on('partyMembersUpdated', this.onPartyMembersUpdate.bind(this));
  }
  update() {
    for (var playerUid in this.playerElems) {
      var playerData = this.playerElems[playerUid];
      var networkEntity = Game.currentGame.world.getEntityByUid(parseInt(playerUid));
      if (!networkEntity) {
        playerData.marker.style.display = 'none';
        continue;
      }
      var xPos = Math.round(networkEntity.getPositionX() / Game.currentGame.world.getWidth() * 100);
      var yPos = Math.round(networkEntity.getPositionY() / Game.currentGame.world.getHeight() * 100);
      playerData.marker.setAttribute('data-index', playerData.index.toString());
      playerData.marker.style.display = 'block';
      playerData.marker.style.left = xPos + '%';
      playerData.marker.style.top = yPos + '%';
    }
  }
  onBuildingsUpdate(buildings) {
    var staleElems = {};
    for (var buildingUid in this.buildingElems) {
      staleElems[buildingUid] = true;
    }
    for (var buildingUid in buildings) {
      delete staleElems[buildingUid];
      if (!this.buildingElems[buildingUid]) {
        var buildingElem = this.ui.createElement("<div class=\"hud-map-building\"></div>");
        var xPos = Math.round(buildings[buildingUid].x / Game.currentGame.world.getWidth() * 100);
        var yPos = Math.round(buildings[buildingUid].y / Game.currentGame.world.getHeight() * 100);
        buildingElem.style.left = xPos + '%';
        buildingElem.style.top = yPos + '%';
        this.componentElem.appendChild(buildingElem);
        this.buildingElems[buildingUid] = buildingElem;
      }
    }
    for (var buildingUid in staleElems) {
      if (!this.buildingElems[buildingUid]) {
        continue;
      }
      this.buildingElems[buildingUid].remove();
      delete this.buildingElems[buildingUid];
    }
  }
  onPartyMembersUpdate(partyMembers) {
    var staleElems = {};
    for (var playerUid in this.playerElems) {
      staleElems[playerUid] = true;
    }
    for (var i in partyMembers) {
      var index = parseInt(i);
      var playerUid = partyMembers[i].playerUid;
      delete staleElems[playerUid];
      if (this.playerElems[playerUid]) {
        this.playerElems[playerUid].index = index;
      }
      else {
        var partyMemberElem = this.ui.createElement("<div class=\"hud-map-player\" data-index=\"" + index + "\"></div>");
        this.componentElem.appendChild(partyMemberElem);
        this.playerElems[playerUid] = {
          index: index,
          marker: partyMemberElem
        };
      }
    }
    for (var playerUid in staleElems) {
      if (!this.playerElems[playerUid]) {
        continue;
      }
      this.playerElems[playerUid].marker.remove();
      delete this.playerElems[playerUid];
    }
  }
}

export default UiMap;
