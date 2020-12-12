import UiComponent from "Game/Ui/UiComponent";
import template from "template/ui-announcement-overlay.html";
import Debug from "debug";

const debug = Debug('Game:Ui/UiAnnouncementOverlay');

class UiAnnouncementOverlay extends UiComponent {
  constructor(ui) {
    return super(ui, template);
  }
  showAnnouncement(message) {
    debug('Displaying announcement: %s', message);
    var announcementElem = this.ui.createElement("<div class=\"hud-announcement-message\">" + message + "</div>");
    this.componentElem.appendChild(announcementElem);
    setTimeout(function () {
      announcementElem.remove();
    }, 8000);
  }
}

export default UiAnnouncementOverlay;
