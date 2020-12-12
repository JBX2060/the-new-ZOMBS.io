import Game from "Game/Game/Game";
import UiComponent from "Game/Ui/UiComponent";
import template from "template/ui-walkthrough.html";
import Debug from "debug";

const debug = Debug('Game:Ui/UiWalkthrough');

class UiWalkthrough extends UiComponent {
  constructor(ui) {
    super(ui, template);
    this.hasCompleted = {};
    this.stepPopupIds = {};
    this.currentStep = 1;
    this.inWalkthrough = false;
    this.steps = {
      '1': {
        message: 'Start off by gathering some resources. Collect <strong>10 wood and stone</strong> using <strong>WASD</strong> keys and harvesting with <strong>Left Click</strong>.',
        icon: '/asset/image/ui/entities/entities-tree.svg'
      },
      '2': {
        message: 'Now you\'re ready to place down your <strong>Gold Stash</strong> &mdash; once you establish your base <strong>zombies will start spawning each night</strong>.',
        icon: '/asset/image/ui/entities/entities-gold-stash.svg'
      },
      '3': {
        message: 'You\'re ready to start building your defenses! Start by using the <strong>5 wood</strong> you gathered earlier to place an <strong>Arrow Tower</strong> from the toolbar below.',
        icon: '/asset/image/ui/entities/entities-arrow-tower.svg'
      },
      '4': {
        message: 'Now you\'re protected you should start generating gold. Do this by building a <strong>Gold Mine</strong> from the toolbar &mdash; this will passively give your entire party gold.',
        icon: '/asset/image/ui/entities/entities-gold-mine.svg'
      }
    };
    Game.currentGame.network.addEnterWorldHandler(this.onEnterWorld.bind(this));
  }
  restart() {
    var popupOverlay = this.ui.getComponent('PopupOverlay');
    debug('Starting walkthrough...');
    if ('localStorage' in window) {
      window.localStorage.removeItem('walkthroughCompleted');
    }
    this.currentStep = 1;
    this.inWalkthrough = true;
    this.stepPopupIds[this.currentStep] = popupOverlay.showHint(this.steps[this.currentStep].message, 30000, this.steps[this.currentStep].icon);
  }
  markStepAsCompleted(step) {
    var popupOverlay = this.ui.getComponent('PopupOverlay');
    if (!this.inWalkthrough || this.hasCompleted[step]) {
      return;
    }
    debug('Marking step as completed: %d', step);
    this.hasCompleted[step] = true;
    if (step !== this.currentStep) {
      return;
    }
    if (this.stepPopupIds[this.currentStep]) {
      popupOverlay.removePopup(this.stepPopupIds[this.currentStep]);
    }
    if (Object.keys(this.hasCompleted).length === Object.keys(this.steps).length) {
      debug('Completed walkthrough!');
      window.localStorage.setItem('walkthroughCompleted', 'true');
      return;
    }
    this.currentStep = null;
    for (var i in this.steps) {
      if (!this.hasCompleted[i]) {
        this.currentStep = parseInt(i);
        break;
      }
    }
    if (!this.currentStep) {
      debug('Completed walkthrough!');
      window.localStorage.setItem('walkthroughCompleted', 'true');
      return;
    }
    this.stepPopupIds[this.currentStep] = popupOverlay.showHint(this.steps[this.currentStep].message, 30000, this.steps[this.currentStep].icon);
  }
  onEnterWorld(data) {
    if (!data.allowed) {
      return;
    }
    if (!('localStorage' in window)) {
      return;
    }
    if (window.localStorage.getItem('walkthroughCompleted') == 'true') {
      return;
    }
    this.restart();
  }
}

export default UiWalkthrough;
