from Logger.Logger import logger
from Prices.Prices import Prices

class Item:
  def __init__(self, data):
    self.name = data["name"] or "Unnamed item"
    self.description = data["description"] or "A mysterious item"
    self.cost = data["cost"] or [Prices.free()]
    self.tiers = data["tiers"] or 1
