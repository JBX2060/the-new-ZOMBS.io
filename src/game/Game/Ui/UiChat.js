import Game from "Game/Game/Game";
import UiComponent from "Game/Ui/UiComponent";
import template from "template/ui-chat.html";
import xss from "xss";
import Debug from "debug";

const debug = Debug('Game:Ui/UiChat');

class UiChat extends UiComponent {
  constructor(ui) {
    super(ui, template);

    this.currentChannel = 1;
    this.channels = [];
    this.channel = this.componentElem.querySelector('.hud-chat-channel');
    this.messageInputElem = this.componentElem.querySelector('.hud-chat-input');
    this.messagesElem = this.componentElem.querySelector('.hud-chat-messages');

    this.channel.addEventListener("click", this.onChannelClick.bind(this));
    this.messageInputElem.addEventListener('blur', this.onMessageInputBlur.bind(this));
    this.messageInputElem.addEventListener('keyup', this.onMessageKeyUp.bind(this));
    Game.currentGame.network.addRpcHandler('ReceiveChatMessage', this.onMessageReceived.bind(this));
    Game.currentGame.network.addEnterWorldHandler(this.onEnterWorld.bind(this));
  }
  onEnterWorld(data) {
    this.channels = data.availableChatChannels;
  }
  startTyping() {
    this.componentElem.classList.add('is-focused');
    this.messageInputElem.focus();
  }
  cancelTyping() {
    this.componentElem.classList.remove('is-focused');
    this.messageInputElem.blur();
  }
  sendMessage(message) {
    if (!message || message.trim().length === 0) {
      setTimeout(() => {
        this.cancelTyping();
      }, 0);
      return;
    }
    debug('Sending message to local channel: %s', message);
    var chatRpc = {
      name: 'SendChatMessage',
      channel: this.channel.textContent,
      message: message
    };
    Game.currentGame.network.sendRpc(chatRpc);
    setTimeout(() => {
      this.cancelTyping();
    }, 0);
  }
  onMessageInputBlur(event) {
    this.cancelTyping();
  }
  onMessageKeyUp(event) {
    var keyCode = event.keyCode;
    if (keyCode === 27) {
      this.cancelTyping();
      return;
    }
    if (keyCode === 13) {
      this.sendMessage(this.messageInputElem.value);
      this.messageInputElem.value = null;
      return;
    }
  }
  onChannelClick(event) {
    this.startTyping();
    this.channel.textContent = this.channels[this.currentChannel++];
    if (this.currentChannel == this.channels.length) {
      this.currentChannel = 0;
    }
  }
  onMessageReceived(response) {
    var displayName = xss(response.displayName, { whiteList: [] });
    var message = xss(response.message, { whiteList: [] });
    var messageElem = this.ui.createElement("<div class=\"hud-chat-message\"><strong>" + displayName + "</strong>: " + message + "</div>");
    this.messagesElem.appendChild(messageElem);
    this.messagesElem.scrollTop = this.messagesElem.scrollHeight;
  }
}

export default UiChat;
