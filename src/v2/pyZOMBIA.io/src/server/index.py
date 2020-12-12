import sys
import pymunkoptions
pymunkoptions.options["debug"] = False

from Logger.Logger import logger
from Network.NetworkServer import NetworkServer
from ConfigLoader.Load import config
from World.World import World
from data import data

import ShopItems.Pickaxe
import ShopItems.HealthPotion

if __name__ == "__main__":
  data["world"] = World()
  data["network_server"] = NetworkServer()

  logger.info("Server has started")

