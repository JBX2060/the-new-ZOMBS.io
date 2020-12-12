import UiComponent from "Game/Ui/UiComponent";
import template from "template/ui-popup-overlay.html";
import Debug from "debug";

const debug = Debug('Game:Ui/UiPopupOverlay');

class UiPopupOverlay extends UiComponent {
  constructor(ui) {
    super(ui, template);
    this.popupElems = {};
    this.popupTimers = {};
    this.popupMessages = {};
  }
  showHint(message, timeoutInMs, icon) {
    if (timeoutInMs === void 0) {
      timeoutInMs = 8000;
    }
    if (icon === void 0) {
      icon = null;
    }
    debug('Displaying hint popup: %s, %s', message, icon);
    for (var popupId in this.popupMessages) {
      if (this.popupMessages[popupId] == message) {
        return false;
      }
    }
    var popupId = Math.round(Math.random() * 10000000);
    var popupElem = this.ui.createElement("<div class=\"hud-popup-message hud-popup-hint is-visible\">" + message + "</div>");
    if (icon) {
      popupElem.classList.add('has-icon');
      popupElem.appendChild(this.ui.createElement("<span class=\"hud-popup-icon\" style=\"background-image:url('" + icon + "');\"></span>"));
    }
    this.componentElem.appendChild(popupElem);
    this.popupElems[popupId] = popupElem;
    this.popupTimers[popupId] = setTimeout(() => {
      this.removePopup(popupId);
    }, timeoutInMs);
    this.popupMessages[popupId] = message;
    return popupId;
  }
  showConfirmation(message, timeoutInMs, acceptCallback, declineCallback) {
    if (timeoutInMs === void 0) {
      timeoutInMs = 30000;
    }
    if (acceptCallback === void 0) {
      acceptCallback = null;
    }
    if (declineCallback === void 0) {
      declineCallback = null;
    }
    debug('Displaying confirmation popup: %s', message);
    var popupId = Math.round(Math.random() * 10000000);
    var popupElem = this.ui.createElement("<div class=\"hud-popup-message hud-popup-confirmation is-visible\">\n            <span>" + message + "</span>\n            <div class=\"hud-confirmation-actions\">\n                <a class=\"btn btn-green hud-confirmation-accept\">Yes</a>\n                <a class=\"btn hud-confirmation-decline\">No</a>\n            </div>\n        </div>");
    this.componentElem.appendChild(popupElem);
    this.popupElems[popupId] = popupElem;
    var acceptElem = popupElem.querySelector('.hud-confirmation-accept');
    var declineElem = popupElem.querySelector('.hud-confirmation-decline');
    acceptElem.addEventListener('click', event => {
      event.stopPropagation();
      this.removePopup(popupId);
      if (acceptCallback) {
        acceptCallback();
      }
    });
    declineElem.addEventListener('click', event => {
      event.stopPropagation();
      this.removePopup(popupId);
      if (declineCallback) {
        declineCallback();
      }
    });
    this.popupTimers[popupId] = setTimeout(() => {
      this.removePopup(popupId);
    }, timeoutInMs);
    return popupId;
  }
  removePopup(popupId) {
    var popupElem = this.popupElems[popupId];
    if (!popupElem) {
      return;
    }
    if (this.popupTimers[popupId]) {
      clearInterval(this.popupTimers[popupId]);
    }
    delete this.popupElems[popupId];
    delete this.popupTimers[popupId];
    delete this.popupMessages[popupId];
    popupElem.classList.remove('is-visible');
    setTimeout(function () {
      popupElem.remove();
    }, 500);
  }
}

export default UiPopupOverlay;
