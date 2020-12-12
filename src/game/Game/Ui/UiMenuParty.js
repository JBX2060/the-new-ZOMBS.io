import template from "template/ui-menu-party.html";
import Game from "Game/Game/Game";
import UiComponent from "Game/Ui/UiComponent";
import xss from "xss";
import Debug from "debug";

var debug = Debug('Game:Ui/UiMenuParty');

class UiMenuParty extends UiComponent {
  constructor(ui) {
    super(ui, template)

    this.tabElems = [];
    this.partyElems = {};
    this.memberElems = [];
    this.activeType = 'Members';
    this.maxPartySize = 4;
    this.closeElem = this.componentElem.querySelector('.hud-menu-close');
    this.serverElem = this.componentElem.querySelector('.hud-party-server');
    this.gridElem = this.componentElem.querySelector('.hud-party-grid');
    this.gridJoiningElem = this.componentElem.querySelector('.hud-party-joining');
    this.gridEmptyElem = this.componentElem.querySelector('.hud-party-empty');
    this.membersElem = this.componentElem.querySelector('.hud-party-members');
    this.tagInputElem = this.componentElem.querySelector('.hud-party-tag');
    this.shareInputElem = this.componentElem.querySelector('.hud-party-share');
    this.visibilityElem = this.componentElem.querySelector('.hud-party-visibility');
    var rawTabElements = this.componentElem.querySelectorAll('.hud-party-tabs-link');
    for (var i = 0; i < rawTabElements.length; i++) {
      this.tabElems[i] = rawTabElements[i];
      this.tabElems[i].addEventListener('click', this.onTabChange(this.tabElems[i]).bind(this));
    }
    this.componentElem.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.componentElem.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.closeElem.addEventListener('click', this.hide.bind(this));
    this.tagInputElem.addEventListener('keyup', this.onTagChange.bind(this));
    this.shareInputElem.addEventListener('focus', this.onShareFocus.bind(this));
    this.visibilityElem.addEventListener('click', this.onVisibilityToggle.bind(this));
    this.ui.on('partyJoined', this.onPartyJoined.bind(this));
    this.ui.on('partyMembersUpdated', this.onPartyMembersUpdated.bind(this));
    this.ui.on('partiesUpdated', this.onPartiesUpdated.bind(this));
    Game.currentGame.network.addRpcHandler('PartyApplicant', this.onPartyApplicant.bind(this));
    Game.currentGame.network.addRpcHandler('PartyApplicantDenied', this.onPartyApplicantDenied.bind(this));
    Game.currentGame.network.addRpcHandler('PartyApplicantExpired', this.onPartyApplicantExpired.bind(this));
  }
  update() {
    var parties = this.ui.getParties();
    var playerIsLeader = this.ui.getPlayerPartyLeader();
    var playerPartyData = parties[this.ui.getPlayerPartyId()];
    var playerPartyMembers = this.ui.getPlayerPartyMembers();
    var serverId = this.ui.getOption('serverId');
    var staleElems = {};
    var availableParties = 0;
    for (var partyId in this.partyElems) {
      staleElems[partyId] = true;
    }
    for (var partyId in parties) {
      var partyData = parties[partyId];
      var partyElem = this.partyElems[partyId];
      var partyNameSanitized = xss(partyData.partyName, { whiteList: [] });
      delete staleElems[partyId];
      if (!this.partyElems[partyId]) {
        partyElem = this.ui.createElement("<div class=\"hud-party-link\"></div>");
        this.gridElem.appendChild(partyElem);
        this.partyElems[partyId] = partyElem;
        partyElem.addEventListener('click', this.onPartyJoinRequestHandler(partyData.partyId).bind(this));
      }
      if (partyData.isOpen) {
        partyElem.style.display = 'block';
        availableParties++;
      }
      else {
        partyElem.style.display = 'none';
      }
      if (this.ui.getPlayerPartyId() === partyData.partyId) {
        partyElem.classList.add('is-active');
        partyElem.classList.remove('is-disabled');
      }
      else if (partyData.memberCount === this.maxPartySize) {
        partyElem.classList.remove('is-active');
        partyElem.classList.add('is-disabled');
      }
      else {
        partyElem.classList.remove('is-active');
        partyElem.classList.remove('is-disabled');
      }
      partyElem.innerHTML = "<strong>" + partyNameSanitized + "</strong><span>" + partyData.memberCount + "/" + this.maxPartySize + "</span>";
    }
    for (var partyId in staleElems) {
      if (!this.partyElems[partyId]) {
        continue;
      }
      this.partyElems[partyId].remove();
      delete this.partyElems[partyId];
    }
    for (var i in this.memberElems) {
      this.memberElems[i].remove();
      delete this.memberElems[i];
    }
    for (var i in playerPartyMembers) {
      var playerName = xss(playerPartyMembers[i].displayName, { whiteList: [] });
      var memberElem = this.ui.createElement("<div class=\"hud-member-link\">\n                <strong>" + playerName + "</strong>\n                <small>" + (playerPartyMembers[i].isLeader === 1 ? 'Leader' : 'Member') + "</small>\n                <div class=\"hud-member-actions\">\n                    <a class=\"hud-member-can-sell btn" + (!playerIsLeader || playerPartyMembers[i].isLeader === 1 ? ' is-disabled' : '') + (playerPartyMembers[i].canSell === 1 ? ' is-active' : '') + "\"><span class=\"hud-can-sell-tick\"></span> Can sell buildings</a>\n                    <a class=\"hud-member-kick btn btn-red" + (!playerIsLeader || playerPartyMembers[i].isLeader === 1 ? ' is-disabled' : '') + "\">Kick</a>\n                </div>\n            </div>");
      this.membersElem.appendChild(memberElem);
      this.memberElems[i] = memberElem;
      if (playerIsLeader && playerPartyMembers[i].isLeader === 0) {
        var kickElem = memberElem.querySelector('.hud-member-kick');
        var canSellElem = memberElem.querySelector('.hud-member-can-sell');
        kickElem.addEventListener('click', this.onPartyMemberKick(i).bind(this));
        canSellElem.addEventListener('click', this.onPartyMemberCanSellToggle(i).bind(this));
      }
    }
    if (availableParties > 0) {
      this.gridEmptyElem.style.display = 'none';
    }
    else {
      this.gridEmptyElem.style.display = 'block';
    }
    if (!playerPartyData) {
      this.tagInputElem.setAttribute('disabled', 'true');
      this.tagInputElem.value = '';
      this.shareInputElem.setAttribute('disabled', 'true');
      this.shareInputElem.value = '';
      this.visibilityElem.classList.add('is-disabled');
      return;
    }
    if (document.activeElement !== this.tagInputElem) {
      this.tagInputElem.value = playerPartyData.partyName;
    }
    if (playerIsLeader) {
      this.tagInputElem.removeAttribute('disabled');
    }
    else {
      this.tagInputElem.setAttribute('disabled', 'true');
    }
    this.shareInputElem.removeAttribute('disabled');
    this.shareInputElem.value = 'http://' + document.location.host + '/#/' + serverId + '/' + this.ui.getPlayerPartyShareKey();
    if (playerIsLeader) {
      this.visibilityElem.classList.remove('is-disabled');
    }
    else {
      this.visibilityElem.classList.add('is-disabled');
    }
    if (playerPartyData.isOpen) {
      this.visibilityElem.classList.remove('is-private');
      this.visibilityElem.innerText = 'Public';
    }
    else {
      this.visibilityElem.classList.add('is-private');
      this.visibilityElem.innerText = 'Private';
    }
  }
  setTab(type) {
    debug('Setting active tab to: %s', type);
    for (var i = 0; i < this.tabElems.length; i++) {
      var tabType = this.tabElems[i].getAttribute('data-type');
      if (type === tabType) {
        this.tabElems[i].classList.add('is-active');
      }
      else {
        this.tabElems[i].classList.remove('is-active');
      }
    }
    this.activeType = type;
    if (this.activeType == 'Members') {
      this.gridElem.style.display = 'none';
      this.membersElem.style.display = 'block';
    }
    else {
      this.gridElem.style.display = 'block';
      this.membersElem.style.display = 'none';
    }
  }
  onTabChange(tabElem) {
    return event => {
      var type = tabElem.getAttribute('data-type');
      this.setTab(type);
    };
  }
  onMouseDown(event) {
    event.stopPropagation();
  }
  onMouseUp(event) {
    event.stopPropagation();
  }
  onPartyJoined(partyId) {
    this.gridElem.classList.remove('is-disabled');
    this.gridJoiningElem.style.display = 'none';
    this.update();
  }
  onPartyMembersUpdated(partyId) {
    this.update();
  }
  onPartiesUpdated() {
    this.update();
  }
  onTagChange(event) {
    var partyName = this.tagInputElem.value.trim();
    if (partyName.length === 0) {
      partyName = this.ui.getPlayerTick().name;
    }
    var partyNameRpc = {
      name: 'SetPartyName',
      partyName: partyName
    };
    Game.currentGame.network.sendRpc(partyNameRpc);
  }
  onShareFocus(event) {
    this.shareInputElem.select();
  }
  onVisibilityToggle(event) {
    var parties = this.ui.getParties();
    var partyId = this.ui.getPlayerPartyId();
    event.stopPropagation();
    if (this.visibilityElem.classList.contains('is-disabled')) {
      return;
    }
    var openPartyRpc = {
      name: 'SetOpenParty',
      isOpen: parties[partyId].isOpen ? 0 : 1
    };
    Game.currentGame.network.sendRpc(openPartyRpc);
  }
  onPartyMemberKick(i) {
    return event => {
      var partyMembers = this.ui.getPlayerPartyMembers();
      var popupOverlay = this.ui.getComponent('PopupOverlay');
      event.stopPropagation();
      var kickPartyRpc = {
        name: 'KickParty',
        uid: partyMembers[i].playerUid
      };
      popupOverlay.showConfirmation('Are you sure you want to kick this player from your party?', 10000, function () {
        Game.currentGame.network.sendRpc(kickPartyRpc);
      });
    };
  }
  onPartyMemberCanSellToggle(i) {
    return event => {
      var partyMembers = this.ui.getPlayerPartyMembers();
      event.stopPropagation();
      var canSellRpc = {
        name: 'SetPartyMemberCanSell',
        uid: partyMembers[i].playerUid,
        canSell: partyMembers[i].canSell === 1 ? 0 : 1
      };
      Game.currentGame.network.sendRpc(canSellRpc);
    };
  }
  onPartyJoinRequestHandler(partyId) {
    return event => {
      var linkElem = this.partyElems[partyId];
      event.stopPropagation();
      if (linkElem.classList.contains('is-disabled') || linkElem.classList.contains('is-active')) {
        return;
      }
      var buildings = this.ui.getBuildings();
      if (Object.keys(buildings).length === 0) {
        this.gridElem.classList.add('is-disabled');
        this.gridJoiningElem.style.display = 'block';
        var joinPartyRpc = {
          name: 'JoinParty',
          partyId: partyId
        };
        Game.currentGame.network.sendRpc(joinPartyRpc);
        return;
      }
      var popupOverlay = this.ui.getComponent('PopupOverlay');
      popupOverlay.showConfirmation("Your existing base will be destroyed if you join this party. Are you sure?", 10000, function () {
        this.gridElem.classList.add('is-disabled');
        this.gridJoiningElem.style.display = 'block';
        var joinPartyRpc = {
          name: 'JoinParty',
          partyId: partyId
        };
        Game.currentGame.network.sendRpc(joinPartyRpc);
      });
    };
  }
  onPartyApplicant(response) {
    var popupOverlay = this.ui.getComponent('PopupOverlay');
    var playerName = xss(response.displayName, { whiteList: [] });
    debug('Showing party applicant confirmation: ', response);
    popupOverlay.showConfirmation("<strong>" + playerName + "</strong> wants to join your party...", 30000, function () {
      var decideRpc = {
        name: 'PartyApplicantDecide',
        applicantUid: response.applicantUid,
        accepted: 1
      };
      Game.currentGame.network.sendRpc(decideRpc);
    }, function () {
      var decideRpc = {
        name: 'PartyApplicantDecide',
        applicantUid: response.applicantUid,
        accepted: 0
      };
      Game.currentGame.network.sendRpc(decideRpc);
    });
  }
  onPartyApplicantDenied(response) {
    this.gridElem.classList.remove('is-disabled');
    this.gridJoiningElem.style.display = 'none';
  }
  onPartyApplicantExpired(response) {
    this.gridElem.classList.remove('is-disabled');
    this.gridJoiningElem.style.display = 'none';
  }
}

export default UiMenuParty;
