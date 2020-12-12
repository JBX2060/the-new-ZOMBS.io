import Game from "Game/Game/Game";
import UiComponent from "Game/Ui/UiComponent";
import xss from "xss";
import request from "browser-request";

class UiIntro extends UiComponent {
  constructor(ui) {
    super(ui, "<span></span>");
    this.connecting = false;
    this.componentElem = document.querySelector('.hud-intro');
    this.nameInputElem = this.componentElem.querySelector('.hud-intro-name');
    this.serverElem = this.componentElem.querySelector('.hud-intro-server');
    this.submitElem = this.componentElem.querySelector('.hud-intro-play');
    this.errorElem = this.componentElem.querySelector('.hud-intro-error');
    this.leaderboardCategoryInputElem = this.componentElem.querySelector('.hud-intro-leaderboard-category');
    this.leaderboardTimeInputElem = this.componentElem.querySelector('.hud-intro-leaderboard-time');
    this.leaderboardPartiesElem = this.componentElem.querySelector('.hud-intro-leaderboard-parties');
    if ('localStorage' in window) {
      this.nameInputElem.value = window.localStorage.getItem('name');
    }
    this.nameInputElem.addEventListener('keyup', this.onNameInputKeyUp.bind(this));
    this.submitElem.addEventListener('click', this.onSubmitClick.bind(this));
    this.leaderboardTimeInputElem.addEventListener('change', this.onFetchLeaderboardData.bind(this));
    this.leaderboardCategoryInputElem.addEventListener('change', this.onFetchLeaderboardData.bind(this));
    Game.currentGame.network.addConnectHandler(this.onConnectionStart.bind(this));
    Game.currentGame.network.addErrorHandler(this.onConnectionError.bind(this));
    Game.currentGame.network.addEnterWorldHandler(this.onEnterWorld.bind(this));
    this.checkForPartyInvitation();
  }
  hide() {
    super.hide.call(this);
  }
  onNameInputKeyUp(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
      this.submitElem.click();
    }
  }
  onSubmitClick(event) {
    var server = this.ui.getOption('servers')[this.serverElem.value];
    if ('localStorage' in window) {
      window.localStorage.setItem('name', this.nameInputElem.value.trim());
    }
    if (this.connecting) {
      return;
    }
    this.connecting = true;
    this.connectionTimer = setTimeout(() => {
      this.connecting = false;
      Game.currentGame.network.disconnect();
      this.submitElem.innerHTML = 'Play';
      this.serverElem.classList.add('has-error');
      this.errorElem.style.display = 'block';
      this.errorElem.innerText = 'We failed to join the game - this is a known issue with anti-virus software. Please try disabling any web filtering features.';
    }, 5000);
    this.submitElem.innerHTML = '<span class="hud-loading"></span>';
    this.errorElem.style.display = 'none';
    this.ui.setOption('nickname', this.nameInputElem.value.trim());
    this.ui.setOption('serverId', this.serverElem.value);
    Game.currentGame.network.connect(server);
  }
  onCanvasInputChange(event) {
    if ('localStorage' in window) {
      window.localStorage.setItem('forceCanvas', this.canvasInputElem.checked ? 'true' : 'false');
    }
    window.location.reload();
  }
  onConnectionStart() {
    Game.currentGame.network.sendEnterWorld({
      displayName: this.ui.getOption('nickname')
    });
  }
  onConnectionError() {
    this.connecting = false;
    if (this.connectionTimer) {
      clearInterval(this.connectionTimer);
      delete this.connectionTimer;
    }
    this.submitElem.innerHTML = 'Play';
    this.serverElem.classList.add('has-error');
    this.errorElem.style.display = 'block';
    this.errorElem.innerText = 'We were unable to connect to the gameserver. Please try another server.';
  }
  onEnterWorld(data) {
    this.connecting = false;
    if (this.connectionTimer) {
      clearInterval(this.connectionTimer);
      delete this.connectionTimer;
    }
    if (!data.allowed) {
      this.submitElem.innerHTML = 'Play';
      this.serverElem.classList.add('has-error');
      this.errorElem.style.display = 'block';
      this.errorElem.innerText = 'This server is currently full. Please try again later or select another server.';
      return;
    }
    this.hide();
    if (this.reconnectKey) {
    }
  }
  getApiUrl(category, timeFrame) {
    let apiUrl = null;
    if (process.env.NODE_ENV == "production") {
      // API URL is not the same in
      // production and developement
      apiUrl = "/api/leaderboard/data";
    } else {
      apiUrl = "http://127.0.0.1:8008/leaderboard/data";
    }
    return apiUrl + '?category=' + category + '&time=' + timeFrame
  }
  onFetchLeaderboardData() {
    var category = this.leaderboardCategoryInputElem.value;
    var timeFrame = this.leaderboardTimeInputElem.value;
    this.leaderboardPartiesElem.innerHTML = "<span class=\"hud-loading\"></span>";
    request.get(this.getApiUrl(category, timeFrame), (err, response, body) => {
      if (err) {
        this.leaderboardPartiesElem.innerHTML = "<span class=\"hud-leaderboard-empty\">Failed to load.</span>";
        return;
      }
      try {
        var leaderboardHtml = "";
        var leaderboardData = JSON.parse(body).parties;
        for (var i in leaderboardData) {
          var leaderboardParty = leaderboardData[i];
          var leaderboardPlayers = leaderboardParty.players.map(function (playerName) {
            return xss(playerName, { whiteList: [] });
          }).join(', ').replace(/,(?!.*,)/gmi, ' and');
          if (category == 'score') {
            leaderboardHtml += "<div class=\"hud-leaderboard-party\">" + leaderboardPlayers + " &mdash; <strong>" + leaderboardParty.score.toLocaleString() + "</strong></div>";
          }
          else if (category == 'wave') {
            leaderboardHtml += "<div class=\"hud-leaderboard-party\">" + leaderboardPlayers + " &mdash; <strong>" + leaderboardParty.wave.toLocaleString() + "</strong></div>";
          }
        }
        this.leaderboardPartiesElem.innerHTML = leaderboardHtml;
      } catch {
        this.leaderboardPartiesElem.innerHTML = "<span class=\"hud-leaderboard-empty\">Failed to load.</span>";
        return;
      }
    });
  }
  checkForPartyInvitation() {
    if (!document.location.hash || document.location.hash.length < 2) {
      return;
    }
    var parts = document.location.hash.substring(2).split('/');
    var serverId = parts[0];
    var shareKey = parts[1];
    if (!serverId || !shareKey) {
      return;
    }
    this.serverElem.setAttribute('disabled', 'true');
    this.serverElem.querySelector('option[value="' + serverId + '"]').setAttribute('selected', 'true');
    this.partyShareKey = shareKey;
    Game.currentGame.network.addEnterWorldHandler(data => {
      if (!data.allowed || this.reconnectKey) {
        return;
      }
      var joinRpc = {
        name: 'JoinPartyByShareKey',
        partyShareKey: this.partyShareKey
      };
      Game.currentGame.network.sendRpc(joinRpc);
    });
  }
}

export default UiIntro;
