from Logger.Logger import logger

class Price(dict):
  def free(self):
    self.update({ "free": True })
    return self
  def gold(self, amount):
    self.update({ "gold": amount })
    return self
  def wood(self, amount):
    self.update({ "wood": amount })
    return self
  def stone(self, amount):
    self.update({ "stone": amount })
    return self
  def tokens(self, amount):
    self.update({ "tokens": amount })
    return self

class Prices:
  @staticmethod
  def free():
    return Price({ "free": True })
  @staticmethod
  def gold(amount):
    return Price({ "gold": amount })
  @staticmethod
  def wood(amount):
    return Price({ "wood": amount })
  @staticmethod
  def stone(amount):
    return Price({ "stone": amount })
  @staticmethod
  def tokens(amount):
    return Price({ "tokens": amount })