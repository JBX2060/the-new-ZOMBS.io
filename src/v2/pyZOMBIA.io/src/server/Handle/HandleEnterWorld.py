from Logger.Logger import logger
from Entities.Player import Player
from Network.SendEntityUpdate import SendEntityUpdate
from Network.SendEnterWorld import SendEnterWorld
from ConfigLoader.Load import config
from Util.Util import Util
from data import data

def HandleEnterWorld(socket, packet):
  display_name = packet.get("displayName") or config["default_nickname"]
  logger.info(f"{display_name} wants to join world...")

  player = Player({
    "position": Util.randomPosition(),
    "name": display_name
  })

  data["clients"].update({ player.uid: socket })
  socket.__dict__["uid"] = player.uid

  SendEnterWorld(socket, {
    "msPerTick": 50,
    "displayName": display_name,
    "uid": player["uid"]
  })

  logger.info(f"Created entity with uid {player.uid}")
