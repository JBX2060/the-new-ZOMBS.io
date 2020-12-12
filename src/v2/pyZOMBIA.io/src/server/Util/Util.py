from ConfigLoader.Load import config
from data import data

import random

class Util:
  @staticmethod
  def uid():
    return len(data["entities"]) + 1
  
  @staticmethod
  def randomPosition():
    return {
      "x": random.randint(0, config["map_width"]),
      "y": random.randint(0, config["map_height"])
    }

  @staticmethod
  def socketUid(socket):
    return socket.__dict__["uid"]

  @staticmethod
  def getTick():
    return data["tick"]

  @staticmethod
  def increaseTick():
    data["tick"] += 1

  @staticmethod
  def diff(a, b):
    result = {}
    for key, val in b.items():
      if b.get(key) is not a.get(key):
        result.update({ key: val })
    return result
