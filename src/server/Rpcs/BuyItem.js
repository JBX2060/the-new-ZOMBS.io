import Rpc from "Generate/Rpc";
import shopPrices from "data/shopPrices";
import SendRpc from "Network/SendRpc";
import SERVER_DATA from "data/all";

const buyItem = new Rpc("BuyItem", function (socket, data) {
  shopPrices.forEach(item => {
    if (item.Name == data.itemName) {
      const player = SERVER_DATA.ENTITIES[socket.uid];
      if (!player.canAfford({ gold: item.GoldCosts[data.tier - 1] })) return;
      player.gold -= item.GoldCosts[data.tier - 1]; //maybe make a function for this to make it cleaner
      const tool = {
        itemName: data.itemName,
        tier: data.tier,
        stacks: 1
      };

      socket.tools[tool.itemName] = tool;

      SendRpc(socket, "SetItem", tool);
    }
  });
});

export default buyItem;
