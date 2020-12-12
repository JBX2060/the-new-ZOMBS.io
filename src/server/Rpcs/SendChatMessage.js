import SERVER_DATA from "data/all";
import Rpc from "Generate/Rpc";
import SendRpc from "Network/SendRpc";
import Util from "Util/Util";

const config = Util.loadConfig();
const entities = SERVER_DATA.ENTITIES;
const clients = SERVER_DATA.CLIENTS;

const sendChatMessage = new Rpc("SendChatMessage", function (socket, data) {
  const { channel, message } = data;
  const player = entities[socket.uid];

  if (!channel || !message) return;

  switch (channel) {
    case "Local":
      Object.keys(entities).forEach(uid => {
        const entity = entities[uid];
        const distance = Math.sqrt((Math.pow(entity.position.x - player.position.x, 2)) + (Math.pow(entity.position.y - player.position.y, 2)));

        if (distance <= config["local_chat_distance"] && entity.model == "GamePlayer") {
          const client = clients.find(client => client.uid == uid);

          SendRpc(client, "ReceiveChatMessage", {
            displayName: player.name,
            uid: entity.uid,
            channel: "Local",
            message: message.slice(0, 200)
          });
        }
      });
      break;
    case "Global":
      if (!config["allow_global_chat"]) return;

      Object.keys(entities).forEach(uid => {
        const entity = entities[uid];

        if (entity.model == "GamePlayer") {
          const client = clients.find(client => client.uid == entity.uid);

          SendRpc(client, "ReceiveChatMessage", {
            displayName: player.name,
            uid: entity.uid,
            channel: "Global",
            message: message.slice(0, 200)
          });
        }
      });
      break;
    case "Party":
      Object.keys(entities).forEach(uid => {
        const entity = entities[uid];

        if (entity.partyId == player.partyId) {
          const client = clients.find(client => client.uid == entity.uid);

          SendRpc(client, "ReceiveChatMessage", {
            displayName: player.name,
            uid: entity.uid,
            channel: "Party",
            message: message.slice(0, 200)
          });
        }
      });
      break;
  }
});

export default sendChatMessage;
