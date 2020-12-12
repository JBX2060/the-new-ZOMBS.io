from Logger.Logger import logger
from Define.Item import Item

class Weapon(Item):
  def __init__(self, data):
    super().__init__(data)

  def buy(self):
    logger.info("Buying weapon {0}...".format(self.name))
