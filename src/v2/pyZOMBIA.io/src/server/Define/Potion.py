from Logger.Logger import logger
from Define.Item import Item

class Potion(Item):
  def __init__(self, data):
    super().__init__(data)

  def buy(self):
    logger.info(f"Buying potion {self.name}...")
